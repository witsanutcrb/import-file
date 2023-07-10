const moment = require('moment');
const { generateSecretKey } = require('../../lib/helper/encryption');
const { convertFileNameToObject } = require('../../common');
const { taskValidateFile } = require('./taskValidateFile');
const { taskProcessing } = require('./taskProcessing');
const { sendMail } = require('./sendMail');
const FileSummaryRepository = require('../../database/repository/FileSummaryRepository');

const getGroupRefCode = () => {
  return process.env.GROUP_REF_CODE || generateSecretKey(10);
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

  try {
    console.log('[Param] Group ref code:', groupRefCode);

    await taskValidateFile({ groupRefCode });
    await taskProcessing({ groupRefCode });
  } catch (error) {
    console.log('[Error]', error);
    if (error.status === false) return error;
  } finally {
    const fileSummaries = await FileSummaryRepository.findAllbyKey({
      where: { group_ref_code: groupRefCode },
    });
    const fileSummary = fileSummaries[0];

    console.log(fileSummary);

    await sendMail(
      {
        fileNameToMail: fileSummary.file_name,
        errorStack: null,
        CatchError: null,
        total_record: fileSummary.total_record,
        pass_records: fileSummary.pass_record,
        failed_records: fileSummary.failed_record,
        start_time: fileSummary.start_time,
      },
      { bucketName: null, s3FilePath: null },
    );
  }
};

module.exports = { taskRun };
