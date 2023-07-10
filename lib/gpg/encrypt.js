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

const encryptGPG = async ({ chipherText, SecretId, logger, armorText }) => {
  // if ciphertext is wrtite file to storage and use new path if success remove file

  const ARG_ARMOR = armorText || ''; // --armor
  const publicKey = await _getSecretsValuePlantext(SecretId);

  const inputFile = `/tmp/input${randomString(10)}.txt`;
  const outputFile = `/tmp/output${randomString(10)}.txt`;

  await new Promise((resolve) => {
    fs.writeFile(inputFile, chipherText, () => {
      resolve();
    });
  });

  const result = await new Promise((resolve, reject) => {
    try {
      gpg.importKey(publicKey, async (err, success, keyID) => {
        if (err) {
          console.log('Import Key Error ', err);
          return err;
        }
        let keyName = keyID;
        if (success && (!keyID || keyID === '')) {
          const match = success.toString().match(/gpg: key (.*?):/);
          keyName = match && match[1];
        }
        const args = [
          '--encrypt',
          '--default-key',
          keyName,
          '--recipient',
          keyName,
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

        gpg.callStreaming(inputFile, outputFile, args, async (e, s) => {
          const decryptText = fs.readFileSync(outputFile);
          await fs.unlinkSync(inputFile);
          await fs.unlinkSync(outputFile);
          resolve(decryptText);
        });
      });
    } catch (error) {
      (async () => {
        console.log('error====>', error);
        await fs.unlinkSync(inputFile);
        await fs.unlinkSync(outputFile);
        reject(error);
      })();
    }
  });
  return result;
};
module.exports = { encryptGPG };
