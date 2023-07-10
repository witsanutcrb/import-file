ให้ทำการเข้า รหัสไฟล์ /file/example.txt ด้วย Public Key แล้วใส่ใน Folder file/encrypt
แล้วหลังจากนั้นแกะรหัสไฟล์ด้วย Private Key แล้วใส่ใน file/decrypt


const openpgp = require('openpgp');

##########################

async encryptpgpPassPhraseOnlyPrivate(data, privateKeyArmored, passphrase) {
    try {
      await openpgp.initWorker({ path: 'openpgp.worker.js' });

      const {
        keys: [privateKey],
      } = await openpgp.key.readArmored(privateKeyArmored);
      if (privateKey.keyPacket.isEncrypted)
        await privateKey.decrypt(passphrase);

      const { data: encrypted } = await openpgp.encrypt({
        message: openpgp.message.fromText(data.toString()),
        privateKeys: [privateKey],
      });
      return encrypted;
    } catch (error) {
      console.log(' error : ', error);
      throw error;
    }
  },

#######################

 async decryptpgpPassPhraseOnlyPrivate(
    cipherText,
    privateKeyArmored,
    options = {},
    passphrase,
  ) {
    try {
      await openpgp.initWorker({ path: 'openpgp.worker.js' });

      const {
        keys: [privateKey],
      } = await openpgp.key.readArmored(`${privateKeyArmored}`);

      if (privateKey.keyPacket.isEncrypted)
        await privateKey.decrypt(passphrase);

      const { data: decrypted } = await openpgp.decrypt({
        ...options,
        message: await openpgp.message.readArmored(cipherText),
        privateKeys: [privateKey],
      });
      return decrypted;
    } catch (error) {
      console.log(' error : ', error);
      throw error;
    }
  },
};