const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');

const s3Client = new S3Client({});

const uploadFileToS3 = async ({ bucketName, fileKey, filePath }) => {
  const bucketParams = {
    Bucket: bucketName,
    Key: fileKey,
  };
  try {
    const fileContent = fs.readFileSync(filePath);
    bucketParams.Body = fileContent
    const data = await s3Client.send(new PutObjectCommand(bucketParams));
    return data;
  } catch (err) {
    console.error('Error', err);
    throw err;
  }
};

module.exports = { uploadFileToS3 };
// uploadFileToS3({
//   bucketName: 'tcrb-debtacq-debtacquisition-nonprod',
//   fileKey:
//     'outbound/cust_appointment_data/process/CTRL_PIVOT_TCRB_ASSIGN_MESSENGER_20230705_195410.csv1',
//   filePath: ${__dirname}/s3/hello.txt,
// });