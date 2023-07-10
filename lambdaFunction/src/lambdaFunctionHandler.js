const momenttz = require('moment-timezone');
const {
  logFunction,
  convertFileNameToObject,
  runEcsTask,
} = require('../../common');

module.exports.Handler = async (event, context) => {
  const processingDate = momenttz().tz(process.env.TIMEZONE).format('YYYYMMDD');

  try {
    logFunction(context);
    const s3Bucket = event.Records[0].s3.bucket.name;
    const objectName = decodeURIComponent(
      event.Records[0].s3.object.key.replace(/\+/g, ' '),
    );
    const fileName = objectName.split('/').pop();
    const fileNameObj = convertFileNameToObject(fileName);
    console.log('[Param]', fileNameObj);

    if (fileNameObj.processDate !== processingDate) {
      console.log('[VALIDATE] Processing date is not now');
      return false;
    }
    const ecs_env = [
      {
        name: 'S3_BUCKET',
        value: s3Bucket,
      },
      {
        name: 'OBJECT_NAME',
        value: objectName,
      },
    ];
    await runEcsTask(ecs_env);
    return true;
  } catch (error) {
    console.log('[ERROR] Trigger', error);
    return false;
  }
};
