const {
    S3Client,
    CopyObjectCommand,
  } = require('@aws-sdk/client-s3');
  
  const s3Client = new S3Client({});
  
  const copyFileToS3 = async ({ bucketName, fileKey  , destBucketName , destFileKey }) => {
    const bucketParamsCopy = {
      Bucket: destBucketName,
      Key: destFileKey,
      CopySource : bucketName+"/"+fileKey,
    };

    try {
      await s3Client.send(new CopyObjectCommand(bucketParamsCopy));
      return true;
    } catch (err) {
      console.error('Error', err);
      throw err;
    }
  };
  
  module.exports = { copyFileToS3 };

//   moveFileS3({
//     bucketName: 'tcrb-debtacq-debtacquisition-nonprod',
//     fileKey:
//       'inbound/cust_appointment_data/archive/CTRL_PIVOT_TCRB_ASSIGN_MESSENGER_20230705_195410.csv',
//     CopySource:
//       'tcrb-debtacq-debtacquisition-nonprod/inbound/cust_appointment_data/process/CTRL_PIVOT_TCRB_ASSIGN_MESSENGER_20230705_195410.csv',
//   });
//   moveFileS3
  