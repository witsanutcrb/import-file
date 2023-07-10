const gpg = require('gpg');
const fs = require('fs');
const SecretManager = require('../helper/SecretsManager');

const randomString = (length) => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};
const _getSecretsValuePlantext = async (secretName) => {
  const secrets = new SecretManager();
  const result = await secrets.getSecretStringPlaintext(secretName);
  return result;
};

const decryptGPG = async ({
  readStream,
  SecretId,
  pathInput,
  logger,
  armorText,
}) => {
  // if ciphertext is wrtite file to storage and use new path if success remove file

  const ARG_ARMOR = armorText || ''; // --armor
  const privateKey = await _getSecretsValuePlantext(SecretId);

  const inputFile = pathInput || `/tmp/input${randomString(10)}.txt`;
  const outputFile = `/tmp/output${randomString(10)}.txt`;

  fs.writeFileSync(inputFile, '');
  if (readStream) {
    const writer = await fs.createWriteStream(inputFile, {
      flags: 'w',
    });
    await new Promise((resolve) => {
      try {
        readStream
          .on('data', (chunk) => {
            writer.write(chunk);
            console.log('data');
          })
          .on('end', async () => {
            console.log('end');
            resolve();
          });
      } catch (error) {
        console.log(error);
      }
    });
  }
  // eslint-disable-next-line consistent-return
  const a = new Promise((resolve, reject) => {
    try {
      // eslint-disable-next-line consistent-return
      gpg.importKey(privateKey, async (err, success, keyID) => {
        console.log(
          '🚀 ~ file: decrypt.js:66 ~ gpg.importKey ~ success:',
          success,
        );
        console.log('🚀 ~ file: decrypt.js:66 ~ gpg.importKey ~ keyID:', keyID);
        if (err) {
          console.log('Import Key Error ', err);
          return reject(err);
        }
        const args = [
          '--decrypt',
          '--default-key',
          keyID,
          '--recipient',
          keyID,
          '--trust-model',
          'always', // so we don't get "no assurance this key belongs to the given user"
        ];
        if (logger) {
          console.log(success);
          console.log({ inputFile, outputFile });
        }

        if (ARG_ARMOR) {
          args.push(ARG_ARMOR);
        }

        gpg.callStreaming(inputFile, outputFile, args, () => {
          const decryptText = fs.readFileSync(outputFile).toString();
          fs.unlinkSync(inputFile);
          fs.unlinkSync(outputFile);
          if (!decryptText) {
            return reject(new Error('Decryption failed'));
          }
          return resolve(decryptText);
        });
      });
    } catch (error) {
      console.log(' Decrypt GPG error ====>', error);
      fs.unlinkSync(inputFile);
      fs.unlinkSync(outputFile);
      return reject(error);
    }
  });
  return a;
};
module.exports = { decryptGPG };
