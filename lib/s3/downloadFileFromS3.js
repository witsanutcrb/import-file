const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { createWriteStream } = require('fs');
const fs = require('fs');
// const { Readable, Stream } = require('stream');

const s3Client = new S3Client({});

const downloadFileFromS3 = async ({ bucketName, fileKey }) => {
  const bucketParams = {
    Bucket: bucketName,
    Key: fileKey,
  };
  const splitFileKey = fileKey.split('/');
  const folderName = `${__dirname}/s3`;
  try {
    try {
      if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName);
      }
    } catch (err) {
      console.error(err);
    }

    const data = await s3Client.send(new GetObjectCommand(bucketParams));
    const inputStream = data.Body;
    const downloadPath = `${folderName}/${splitFileKey.pop()}`;
    const outputStream = createWriteStream(downloadPath);

    inputStream.pipe(outputStream);

    await new Promise((resolve) => {
      outputStream.on('finish', () => {
        console.log(`[S3] downloaded the file successfully : `);
        console.log(`${bucketName}/${fileKey}`);
        resolve();
      });
    });
    return downloadPath;
  } catch (err) {
    console.error('Error', err);
    throw err;
  }
};

module.exports = { downloadFileFromS3 };
