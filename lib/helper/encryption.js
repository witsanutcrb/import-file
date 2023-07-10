const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const iv = '0123456789ABCDEF';

const errorMessage = (error) => {
  return {
    errorSecret: true,
    errorCode: 'E0017',
    errorText: error.toString(),
  };
};

const encrypt = (plaintext, key) => {
  try {
    const instance = crypto.createCipheriv(algorithm, key, iv);
    let s_output = instance.update(plaintext, 'utf8', 'hex');
    s_output += instance.final('hex');
    return s_output;
  } catch (error) {
    throw errorMessage(error);
  }
};

const decrypt = (cipherText, key) => {
  try {
    const instance = crypto.createDecipheriv(algorithm, key, iv);
    let s_output = instance.update(cipherText, 'hex', 'utf8');
    s_output = instance.final('utf8');
    return s_output;
  } catch (error) {
    throw errorMessage(error);
  }
};

const encryptShaFromStream = async (stream, hashName = 'sha256') => {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash(hashName);
    stream.on('error', (err) => reject(err));
    stream.on('data', (chunk) => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
  });
};

const generateSecretKey = (size = 16) => {
  return crypto.randomBytes(size).toString('hex');
};

const generateKey = (text, hashName = 'sha256') => {
  const hash = crypto.createHash(hashName);
  hash.update(text);
  return hash.digest('hex').substring(0, 20);
};

module.exports = {
  encrypt,
  decrypt,
  generateSecretKey,
  encryptShaFromStream,
  generateKey,
};
