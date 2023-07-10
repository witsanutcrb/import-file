const moment = require('moment');
const { resultStatusCode } = require('../constructor/enums');
const { generateSecretKey } = require('../lib/helper/encryption');
const { listProcessTask } = require('../constructor/enums');
const { stepProcess } = require('../constructor/enums');
const { convertFileNameToObject } = require('../common');

const runTask = async () => {
  const resultRunTask = await run();
  const { S3_BUCKET, OBJECT_NAME, GROUP_REF_CODE } = process.env;
  const objectName = OBJECT_NAME;
  const bucketName = S3_BUCKET;
  const { fileNameToMail } = resultRunTask;
  if (resultRunTask.status) {
    const { listLog } = resultRunTask;
    console.log('SUCCESS');
    const { listFileName } = resultRunTask;

    let sumTotal = 0;
    let sumPass = 0;
    let sumFailed = 0;
    for await (const fileName of listFileName) {
      const { totalRecord, totalPass, totalReject } = await summaryProcess(
        fileName,
      );
      sumTotal += totalRecord;
      sumPass += totalPass;
      sumFailed += totalReject;
      await saveSummaryGroupAndFileName({
        file_name: fileName,
        group_ref_code: GROUP_REF_CODE,
        file_summary_status: resultStatusCode.complete,
        updated_by: stepProcess.result,
        updated_on: momenttz().format(process.env.DATE_TIME_FORMAT),
        end_time: momenttz().format(process.env.DATE_TIME_FORMAT),
        total_record: totalRecord,
        pass_record: totalPass,
        failed_record: totalReject,
      });
    }
    const getFileSummary = await FileSummaryRepository.findAllbyKey({
      where: { file_name: listFileName },
    });
    const { start_time } = getFileSummary[0];

    await moveFile(fileNameToMail, bucketName, objectName);
    await sendMail(
      {
        fileNameToMail,
        total_record: sumTotal,
        pass_records: sumPass,
        failed_records: sumFailed,
        start_time: moment(start_time).format('DD/MM/YYYY HH:mm:ss'),
      },
      { bucketName, s3FilePath: listLog[0] },
    );

    console.log('====> TASK END SUCCESS');
    return resultRunTask.status;
  }
  const { error } = resultRunTask;
  const errorText = errorToString(error);
  console.log('🚀 ~ file: index.js:211 ~ runTask ~ errorText:', errorText);

  const { listLog = [] } = resultRunTask;

  await moveFile(fileNameToMail, bucketName, objectName, true);
  const response = await ResponseMessageRepository.findByCode(errorText);

  await sendMail(
    {
      fileNameToMail,
      CatchError: true,
      errorStack: response?.business_message_en || errorText,
    },
    { bucketName, s3FilePath: listLog[0] },
  );
  console.log('====> TASK END ERROR');
  return resultRunTask.status;
};

module.exports = { runTask };
