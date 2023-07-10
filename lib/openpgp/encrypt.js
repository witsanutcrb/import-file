const openpgp = require('openpgp');

const encryptPgpPassPhraseOnlyPrivate = async (
  encryptedMessage,
  publicKeyArmored,
) => {
  try {
    // Decrypting the message
    // console.log(openpgp.readKey)
  
    const publicKey =  await openpgp.readKey({
        armoredKey: publicKeyArmored,
      })
    const message = await openpgp.createMessage({
        text: encryptedMessage, // parse armored message
    });
    const encrypted = await openpgp.encrypt({
      message,
      encryptionKeys: publicKey,
    });
    return encrypted;
  } catch (error) {
    console.error('Encryption failed', error);
    throw error;
  }
};

module.exports = { encryptPgpPassPhraseOnlyPrivate };
