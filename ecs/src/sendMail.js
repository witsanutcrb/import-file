const momenttz = require('moment-timezone');

// const { sendEmail } = require('../../send-email-handler/src/sendEmail');

const sendMail = async (
  {
    fileNameToMail,
    errorStack,
    CatchError,
    total_record,
    pass_records,
    failed_records,
    start_time,
  },
  { bucketName, s3FilePath },
) => {
  console.log(
    fileNameToMail,
    errorStack,
    CatchError,
    total_record,
    pass_records,
    failed_records,
    start_time,
  );
  return true;
  await sendEmail(
    {
      code_complate: 'EMAIL0106',
      code_failed: 'EMAIL0107',
      process_name: 'Reach90',
      date: momenttz().tz(process.env.TIMEZONE).format('DD/MM/YYYY HH:mm:ss'),
      start_time:
        start_time ||
        momenttz().tz(process.env.TIMEZONE).format('DD/MM/YYYY HH:mm:ss'),
      end_time: momenttz()
        .tz(process.env.TIMEZONE)
        .format('DD/MM/YYYY HH:mm:ss'),
      filename: `\n${fileNameToMail}`,
      errorStack,
      file_summary_status: CatchError
        ? resultStatusCode.error
        : resultStatusCode.complete,
      totalrecord: total_record,
      passrecord: pass_records,
      failedrecord: failed_records,
    },
    { bucketName, s3FilePath },
  );
};
module.exports = { sendMail };
