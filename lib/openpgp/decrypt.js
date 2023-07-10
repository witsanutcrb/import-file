const openpgp = require('openpgp');

const decryptpgpPassPhraseOnlyPrivate = async (
  encryptedMessage,
  privateKeyArmored,
  passphrase,
) => {
  try {
    // Decrypting the message
    // const privateKey = await openpgp.decryptKey({
    //   privateKey: await openpgp.readPrivateKey({
    //     armoredKey: privateKeyArmored,
    //   }),
    //   passphrase,
    // });
    const privateKey = await openpgp.readPrivateKey({
      armoredKey: privateKeyArmored,
    });
    const message = await openpgp.readMessage({
      armoredMessage: encryptedMessage, // parse armored message
    });
    const { data: decrypted } = await openpgp.decrypt({
      message,
      decryptionKeys: privateKey,
    });
    return decrypted;
  } catch (error) {
    console.error('Decryption failed', error);
    throw error;
  }
};

module.exports = { decryptpgpPassPhraseOnlyPrivate };
