// inbound/customer_status/reach90/archive/TCRB_Reach90_20230623002_001of001.txt.enc
// tcrb-debtacq-debtacquisition-nonprod
const fs = require('fs');
const readStreamFileFromS3 = require('../lib/s3/readFileStreamFromS3');
const { decryptGPG } = require('../lib/gpg');

(async () => {
  const downloadFilePath = await readStreamFileFromS3(
    'tcrb-debtacq-debtacquisition-nonprod',
    'testS3/TCRB_Reach90_20230623002_001of001.txt.gpg',
  );
  const readStream = fs.createReadStream(downloadFilePath);
  // fs.unlinkSync(downloadFilePath);
  //   console.log('🚀 ~ file: s3.js:10 ~ a:', readStream);
  const key = 'key/debt-acq/ascend-debt-private-gpg';
  // const writer = await fs.createWriteStream(`${__dirname}/input.txt`, {
  //   flags: 'w',
  // });
  // await new Promise((resolve) => {
  //   readStream.on('data', (chunk) => {
  //     writer.write(chunk);
  //   });

  //   readStream.on('end', async () => {
  //     resolve();
  //   });
  // });

  const decryptFile = await decryptGPG({ readStream, SecretId: key });
  fs.writeFileSync(`${__dirname}/output`, decryptFile);
  // console.log('🚀 ~ file: s3.js:27 ~ decryptFile:', decryptFile);
})();
