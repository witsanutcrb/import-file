const fs = require('fs');
const { parse } = require('csv-parse/sync');
const { convertFileNameToObject, responseCode  , checkRawData} = require('../../common');
const { downloadFileFromS3 } = require('../../lib/s3');
const { encryptShaFromStream } = require('../../lib/helper/encryption');
const FileControlRepository = require('../../database/repository/FileControlRepository');
const MappingFieldRepository =  require('../../database/repository/MappingFieldRepository');
const {mapping_field} = require('../../lib/mapping-field')

const checkCompareValidate = async (compareValue, errorCode, note) => {
  if (!compareValue) {
    if (note) console.log(note);
    console.log(JSON.stringify(compareValue));
    throw errorCode;
  }
};

const readFileCheckSum = async (filePath) => {
  const fileContent = fs.createReadStream(filePath);
  return encryptShaFromStream(fileContent);
};
const readCtrlFile = async (filePath, fileControl , mappingField) => {
  const { delimeter: delimiter } = fileControl;
  const fileContent = fs.readFileSync(filePath).toString();
  const fileContentRow = fileContent.split('\r\n');
  const arrFileContent = fileContentRow[0].split(delimiter);
  const checkArrFileContent = await checkRawData(arrFileContent , mappingField.length)
  const dataMapping = await mapping_field(checkArrFileContent , mappingField)
  const objCtrl = dataMapping.mapping_field_name
  return objCtrl;
};

const taskValidateFile = async ({ groupRefCode }) => {
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
    const getMappingField = await MappingFieldRepository.findByFileControlID(getFileControl.id)
    const fileCtrlPath = await downloadFileFromS3({
      bucketName: s3Bucket,
      fileKey: objectName,
    });
    const mappingDataCtrl = await readCtrlFile(fileCtrlPath, getFileControl , getMappingField);

    await checkCompareValidate(
      fileNameData === mappingDataCtrl.file_name,
      responseCode.E9001,
      '[Validate] Ctrl File : File Name is incorrect',
    );

    const fileDataPath = await downloadFileFromS3({
      bucketName: s3Bucket,
      fileKey: arrFileKeyData.join('/'),
    });

    const checkSumFileData = await readFileCheckSum(fileDataPath);

    await checkCompareValidate(
      checkSumFileData === mappingDataCtrl.check_sum,
      responseCode.E9002,
      '[Validate] Ctrl File : Check sum is incorrect',
    );

    fs.unlinkSync(fileCtrlPath);
    fs.unlinkSync(fileDataPath);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { taskValidateFile };
