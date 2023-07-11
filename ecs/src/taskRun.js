const moment = require('moment');
const momenttz = require('moment-timezone');
const { generateSecretKey } = require('../../lib/helper/encryption');
const { convertFileNameToObject } = require('../../common');
const { taskValidateFile } = require('./taskValidateFile');
const { taskProcessing } = require('./taskProcessing');
const { sendMail } = require('./sendMail');
const FileSummaryRepository = require('../../database/repository/FileSummaryRepository');

const getGroupRefCode = () => {
  return process.env.GROUP_REF_CODE || generateSecretKey(10);
};

const errorToString = (error) => {
  if (typeof error === 'object') {
    return error.toString();
  }
  return error;
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
const taskRun = async () => {
  const { S3_BUCKET, OBJECT_NAME } = process.env;

  console.log('[Param]', {
    S3_BUCKET,
    OBJECT_NAME,
  });
  const s3Bucket = S3_BUCKET;
  const objectName = OBJECT_NAME;

  const fileNameCtrl = objectName.split('/').pop();
  const fileNameObj = convertFileNameToObject(fileNameCtrl);
  const { fileNameData } = fileNameObj;

  const fileNameToMail = [fileNameData];
  const groupRefCode = getGroupRefCode();
  const logError = {
    errorStack: null,
    catchError: null,
  };

  try {
    console.log('[Param] Group ref code:', groupRefCode);
    const start_time = momenttz()
      .tz(process.env.TIMEZONE)
      .format(process.env.DATETIMEFORMAT);
    const date = momenttz().tz(process.env.TIMEZONE).format('YYYY-MM-DD');
    const time = momenttz().tz(process.env.TIMEZONE).format('HH:mm:ss');
    const objSummary = {
      file_name: fileNameData,
      processing_date: date, // moment().tz(process.env.TIMEZONE).format(YYYY-MM-DD)
      processing_time: time, // moment = time // moment().tz(process.env.TIMEZONE).format(HH:mm:ss)
      channel_code: 'OLA',
      start_time: start_time, // ใส่เวลาเริ่มการทำงาน// moment().tz(process.env.TIMEZONE).format(process.env.DATETIMEFORMAT)
      created_on: start_time, // moment().tz(process.env.TIMEZONE).format(process.env.DATETIMEFORMAT)
      updated_on: start_time, // moment().tz(process.env.TIMEZONE).format(process.env.DATETIMEFORMAT)
      created_by: 'SYSTEM',
      updated_by: 'SYSTEM',
      file_summary_status: 'processing',
      group_ref_code: groupRefCode,
    };

    await taskValidateFile({ groupRefCode });
    await taskProcessing({ groupRefCode });
  } catch (error) {
    console.log('[Error]', error);
    const end_time = momenttz()
      .tz(process.env.TIMEZONE)
      .format(process.env.DATETIMEFORMAT);
    const objSummary = {
      file_name: fileNameData,
      end_time: end_time, // ใส่เวลาสิ้นสุดการทำงาน// moment().tz(process.env.TIMEZONE).format(process.env.DATETIMEFORMAT)
      updated_on: end_time, // moment().tz(process.env.TIMEZONE).format(process.env.DATETIMEFORMAT)
      updated_by: 'SYSTEM',
      file_summary_status: 'error',
      error_code: errorToString(error), //if error ให้เอามาใส่
      group_ref_code: groupRefCode,
    };

    await saveSummary(objSummary);
    logError.errorStack = errorToString(error);
    logError.catchError = true;

    console.log(logError, 'logError');
  } finally {
    const fileSummaries = await FileSummaryRepository.findAllbyKey({
      where: { group_ref_code: groupRefCode },
    });
    const fileSummary = fileSummaries[0];

    console.log(fileSummary);

    await sendMail(
      {
        fileNameToMail: fileSummary.file_name,
        errorStack: logError.errorStack,
        catchError: logError.catchError,
        total_record: fileSummary.total_record,
        pass_records: fileSummary.pass_record,
        failed_records: fileSummary.failed_record,
        start_time: moment(fileSummary.start_time).format(
          'DD/MM/YYYY HH:mm:ss',
        ),
      },
      { bucketName: null, s3FilePath: null },
    );

    process.exit(0);
  }
};

module.exports = { taskRun };
