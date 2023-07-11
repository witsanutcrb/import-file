const fs = require('fs');
const momenttz = require('moment-timezone');
const { parse } = require('csv-parse/sync');
const { generateSecretKey } = require('../../lib/helper/encryption');
const {
  checkDuplicate,
} = require('../../lib/validation/system-validation/validate-row');
const {
  validate,
} = require('../../lib/validation/system-validation/validate-field');
const {
  convertFileNameToObject,
  checkRawData,
  generateReason,
} = require('../../common');
const {
  downloadFileFromS3,
  uploadFileToS3,
  moveFileS3,
} = require('../../lib/s3');
const {
  decryptpgpPassPhraseOnlyPrivate,
} = require('../../lib/openpgp/decrypt');

const {
  encryptPgpPassPhraseOnlyPrivate,
} = require('../../lib/openpgp/encrypt');

const { encryptShaFromStream } = require('../../lib/helper/encryption');

const { mapping_field } = require('../../lib/mapping-field');

const { stringify } = require('csv-stringify');

const MappingFieldRepository = require('../../database/repository/MappingFieldRepository');
const OlaCustomerAppointmentResultRepository = require('../../database/repository/OlaCustomerAppointmentResultRepository');
const SecretsManager = require('../../lib/helper/SecretsManager');
const FileControlRepository = require('../../database/repository/FileControlRepository');
const FileSummaryRepository = require('../../database/repository/FileSummaryRepository');

const { copyFileToS3 } = require('../../lib/s3/copyFileToS3');

const secret = new SecretsManager();

const readFileContent = async (filePath, fileControl) => {
  const fileContent = fs.readFileSync(filePath);
  const csvContent = parse(fileContent, {
    delimiter: fileControl.delimeter,
    bom: true,
  });
  console.log(csvContent);
  return csvContent[0][0];
};

const decryptFile = async ({ filePath, cipherTxt, fileControl }) => {
  const pgpPassphrasePrivateKey = fileControl.encrypt_key.pgp_private_key;
  const pgpPassphraseKey = fileControl.encrypt_key.pgp_passphrase_key;
  const pgpPassphraseKeyValue = fileControl.encrypt_key.pgp_passphrase_value;

  const privateKey = await secret.getSecretStringPlaintext(
    pgpPassphrasePrivateKey,
  );
  const pgpPassphrase = await secret.getSecretString(pgpPassphraseKey);
  const passphraseValue = pgpPassphrase[pgpPassphraseKeyValue];
  const cipherText = cipherTxt || fs.readFileSync(filePath).toString();
  const decryptText = await decryptpgpPassPhraseOnlyPrivate(
    cipherText,
    privateKey,
    passphraseValue,
  );
  return decryptText;
};

const encryptFile = async ({ fileContent, fileControl }) => {
  const pgpPassphrasePublicKey = fileControl.encrypt_key.pgp_public_key;

  const publicKey = await secret.getSecretStringPlaintext(
    pgpPassphrasePublicKey,
  );
  const encryptText = await encryptPgpPassPhraseOnlyPrivate(
    fileContent,
    publicKey,
  );
  return encryptText;
};

const processing = async ({ arrData, fileName, groupRefCode }) => {
  const processDateTime = momenttz()
    .tz(process.env.TIMEZONE)
    .format(process.env.DATETIMEFORMAT);
  const objCheckDupKey = {};
  const mappingField = await MappingFieldRepository.findByFileControlID(151);
  const mappingFieldData = mappingField.filter(
    (row) => row.record_type === 'D',
  );
  const arrDataBody = arrData.slice(1, arrData.length);
  const dataProcessingMap = arrDataBody.map(async (rowData, i) => {
    const newRowData = checkRawData(rowData, mappingFieldData.length);
    const mappingData = await mapping_field(newRowData, mappingFieldData);
    const mappingFieldName = mappingData.mapping_field_name;
    const validateRowResult = checkDuplicate(
      mappingData.mapping_field,
      objCheckDupKey,
    );

    const duplicatedFlag = validateRowResult.duplicated;
    const compareColumn = mappingData.compare_column;
    const validateFieldResult = [];
    if (mappingData.compare_column === 'PASS') {
      mappingData.mapping_field.forEach(async (mappingRow) => {
        const systemValidate = await validate(mappingRow);
        if (Object.keys(systemValidate.result).length) {
          validateFieldResult.push(systemValidate);
          console.log(
            '🚀 ~ file: taskProcessing.js:81 ~ mappingData.mapping_field.forEach ~ validateFieldResult:',
            validateFieldResult,
          );
        }
        return mappingRow;
      });
    }
    console.log(validateFieldResult);
    const reasonResult = await generateReason({
      system_validate_result: { validate_field_result: validateFieldResult },
      duplicated_flag: duplicatedFlag,
      fieldMaster: {},
      responseMessage: {},
    });
    console.log(
      '🚀 ~ file: taskProcessing.js:92 ~ dataProcessingMap ~ reasonResult:',
      reasonResult,
    );
    const { mergeResult, checkResultcode } = reasonResult;
    return {
      ...mappingFieldName,
      file_name: fileName,
      file_name_line_number: `${fileName}_${i + 1}`,
      line_number: `${i + 1}`,
      channel: 'PIVOT',
      entity: 'OLA',
      created_on: processDateTime,
      created_by: 'SYSTEM',
      updated_on: processDateTime,
      updated_by: 'SYSTEM',
      group_ref_code: groupRefCode,
      ref_code: generateSecretKey(10),
      result: checkResultcode === 'PASS' ? '00' : '99',
      reason: mergeResult,
      validate_field_result: validateFieldResult,
      duplicated_flag: duplicatedFlag,
    };
  });
  return Promise.all(dataProcessingMap);
};

const checkSumFileControl = async (filepath) => {
  const checkFileContent = fs.createReadStream(filepath);
  return encryptShaFromStream(checkFileContent);
};

const createFileControl = (
  fileNameData,
  processingDate,
  totalRecordFile,
  checkSum,
) => {
  const fileCtrlName = `${fileNameData}|${totalRecordFile}|${processingDate}|${checkSum}`;
  return fileCtrlName;
};

const getRowFileContent = async (fileContent, getFileData) => {
  const csvContent = parse(fileContent, {
    delimiter: getFileData.delimeter,
    bom: true,
  });
  return csvContent.length - 1;
};

const convertPathS3 = ({ s3Path, destPath }) => {
  const destFolder = destPath || 'archive';
  const arrS3Path = s3Path.split('/');
  const fileName = arrS3Path.pop();
  arrS3Path.pop();
  arrS3Path.push(destFolder);
  arrS3Path.push(fileName);

  const newPathS3 = arrS3Path.join('/');
  return newPathS3;
};

const writeFileCsv = async (fileContent) => {
  const csv_records = [[fileContent]]; // index row 1 col 1
  return new Promise((resolve, reject) => {
    stringify(
      csv_records,
      {
        header: false,
      },
      (err, output) => {
        if (err) {
          reject(err);
        }
        resolve(output);
      },
    );
  });
};

const saveSummary = async (data) => {
  try {
    const file_sum = await FileSummaryRepository.upsert(
      {
        ...data,
      },
      { file_name: data.file_name, group_ref_code: data.group_ref_code },
    );

    return file_sum;
  } catch (error) {
    console.error('saveSummary Error : ', error);
    throw error;
  }
};

const taskProcessing = async ({ groupRefCode }) => {
  const start_time = momenttz()
    .tz(process.env.TIMEZONE)
    .format(process.env.DATETIMEFORMAT);
  const { S3_BUCKET, OBJECT_NAME } = process.env;
  const s3Bucket = S3_BUCKET;
  const objectName = OBJECT_NAME;
  const arrObjectName = objectName.split('/');
  const fileNameCtrl = arrObjectName.pop();
  const fileNameObj = convertFileNameToObject(fileNameCtrl);
  const { fileNameData } = fileNameObj;
  const arrFileKeyData = [...arrObjectName];
  arrFileKeyData.push(fileNameData);

  try {
    const getFileControl = await FileControlRepository.findByPrefixName(
      fileNameCtrl,
      'INPUT',
      'Y',
    );

    const getFileData = await FileControlRepository.findByPrefixName(
      fileNameData,
      'INPUT',
    );

    const outputGetFileData = await FileControlRepository.findByPrefixName(
      fileNameData,
      'OUTPUT',
    );

    const fileDataPath = await downloadFileFromS3({
      bucketName: s3Bucket,
      fileKey: arrFileKeyData.join('/'),
    });
    const processingDate = momenttz()
      .tz(process.env.TIMEZONE)
      .format('YYYYMMDD');
    const csvContent = await readFileContent(fileDataPath, getFileData);
    const fileContent = await decryptFile({
      filePath: fileDataPath,
      cipherTxt: csvContent,
      fileControl: getFileData,
    });

    const encrypted = await encryptFile({
      fileContent,
      fileControl: outputGetFileData,
    });

    const outputPathFile = `${__dirname}/output/${fileNameData}`;
    const outputPathFileCtrl = `${__dirname}/output/CTRL_${fileNameData.replace(
      'csv',
      'txt',
    )}`;
    const decryptedCsv = await writeFileCsv(encrypted);

    fs.writeFileSync(outputPathFile, decryptedCsv);
    const checkSum = await checkSumFileControl(outputPathFile);
    const totalRecordFile = await getRowFileContent(fileContent, getFileData);

    const fileCtrlName = createFileControl(
      fileNameData,
      processingDate,
      totalRecordFile,
      checkSum,
    );
    fs.writeFileSync(outputPathFileCtrl, fileCtrlName);

    const filePathOutput = outputGetFileData.file_path; //tcrb-onlineloan-nonprod/inbound/assign_messenger/process
    const splitFilePathOutput = filePathOutput.split('/');
    const s3BucketOutput = splitFilePathOutput.shift();
    const s3OutputFile = splitFilePathOutput.join('/') + '/' + fileNameData;
    const s3OutputFileCtrl = splitFilePathOutput.join('/') + '/' + fileNameCtrl;

    await uploadFileToS3({
      bucketName: s3BucketOutput,
      fileKey: s3OutputFile,
      filePath: outputPathFile,
    });

    await uploadFileToS3({
      bucketName: s3BucketOutput,
      fileKey: s3OutputFileCtrl,
      filePath: outputPathFileCtrl,
    });

    //move file to BOF//
    const s3BucketBof = 'tcrb-onlineloan-nonprod';
    const s3PathBof = 'input/partner/pivot';

    await copyFileToS3({
      bucketName: s3BucketOutput,
      fileKey: s3OutputFile,
      destBucketName: s3BucketBof,
      destFileKey: s3PathBof + '/' + fileNameData,
    });

    await copyFileToS3({
      bucketName: s3BucketOutput,
      fileKey: s3OutputFileCtrl,
      destBucketName: s3BucketBof,
      destFileKey: s3PathBof + '/' + fileNameCtrl,
    });

    await moveFileS3({
      bucketName: s3BucketOutput,
      fileKey: s3OutputFile,
      destBucketName: s3BucketOutput,
      destFileKey: convertPathS3({
        s3Path: s3OutputFile,
      }),
    });

    await moveFileS3({
      bucketName: s3BucketOutput,
      fileKey: s3OutputFileCtrl,
      destBucketName: s3BucketOutput,
      destFileKey: convertPathS3({
        s3Path: s3OutputFileCtrl,
      }),
    });

    //move file to BOF//

    // await moveFileS3({
    //   bucketName: s3Bucket,
    //   fileKey: arrFileKeyData.join('/'),
    //   destBucketName: s3Bucket,
    //   destFileKey: convertPathS3({
    //     s3Path: arrFileKeyData.join('/'),
    //   }),
    // });

    // await moveFileS3({
    //   bucketName: s3Bucket,
    //   fileKey: objectName,
    //   destBucketName: s3Bucket,
    //   destFileKey: convertPathS3({
    //     s3Path: objectName,
    //   }),
    // });

    fs.unlinkSync(fileDataPath);
    const end_time = momenttz()
      .tz(process.env.TIMEZONE)
      .format(process.env.DATETIMEFORMAT);

    const objSummary = {
      file_name: fileNameData,
      file_type: getFileControl.file_type,
      file_path: getFileControl.file_path,
      total_record: totalRecordFile, //ใส่ total record
      pass_record: totalRecordFile, //ใส่ total record
      failed_record: 0, //ใส่ 0
      end_time: end_time, // ใส่เวลาสิ้นสุดการทำงาน// moment().tz(process.env.TIMEZONE).format(process.env.DATETIMEFORMAT)
      updated_on: end_time, // moment().tz(process.env.TIMEZONE).format(process.env.DATETIMEFORMAT)
      updated_by: 'SYSTEM',
      file_summary_status: 'complete',
      read_record: totalRecordFile, //ใส่ total record
      group_ref_code: groupRefCode,
    };

    await saveSummary(objSummary);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = { taskProcessing };
