const {
    S3Client,
    CopyObjectCommand,
    DeleteObjectCommand,
  } = require('@aws-sdk/client-s3');
  
  const s3Client = new S3Client({});
  
  const moveFileS3 = async ({ bucketName, fileKey  , destBucketName , destFileKey }) => {
    const bucketParamsCopy = {
      Bucket: destBucketName,
      Key: destFileKey,
      CopySource : bucketName+"/"+fileKey,
    };
    const bucketParamsDelete = {
        Bucket: bucketName,
        Key: fileKey,
      };

    try {
      await s3Client.send(new CopyObjectCommand(bucketParamsCopy));
      await s3Client.send(new DeleteObjectCommand(bucketParamsDelete));
      return true;
    } catch (err) {
      console.error('Error', err);
      throw err;
    }
  };
  
  module.exports = { moveFileS3 };

//   moveFileS3({
//     bucketName: 'tcrb-debtacq-debtacquisition-nonprod',
//     fileKey:
//       'inbound/cust_appointment_data/archive/CTRL_PIVOT_TCRB_ASSIGN_MESSENGER_20230705_195410.csv',
//     CopySource:
//       'tcrb-debtacq-debtacquisition-nonprod/inbound/cust_appointment_data/process/CTRL_PIVOT_TCRB_ASSIGN_MESSENGER_20230705_195410.csv',
//   });
//   moveFileS3
  