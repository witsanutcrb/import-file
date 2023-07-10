const crypto = require('crypto');
const openpgp = require('openpgp')
const algorithm = 'aes-256-cbc';
const iv = "0123456789ABCDEF";
const EKYC_GCM_IV_BYTE_LEN = 12;
const EKYC_GCM_TAG_BYTE_LEN = 16;

var Encryption = function () {

}

const encrypt = (plaintext, key) => {
    let instance = crypto.createCipheriv(algorithm, key, iv);
    let s_output = instance.update(plaintext, 'utf8', 'hex');
    s_output += instance.final('hex');
    return s_output;
}

const decrypt = (cipherText, key) => {
    let instance = crypto.createDecipheriv(algorithm, key, iv);
    let s_output = instance.update(cipherText, 'hex', 'utf8');
    s_output = instance.final('utf8');
    return s_output;
}

Encryption.prototype = {
    encrypt256ecb: function (plaintext, key) {
        let cipher = crypto.createCipheriv('aes-256-ecb', key, '');
        let ciphertext = cipher.update(plaintext, 'utf8', 'hex');
        ciphertext += cipher.final('hex');
        return ciphertext;
    },
    decrypt256ecb: function (ciphertext, key) {
        let decipher = crypto.createDecipheriv('aes-256-ecb', key, '');
        let plaintext = decipher.update(ciphertext, 'hex', 'utf8');
        plaintext += decipher.final('utf8');
        return plaintext;
    },
    encryptEkyc: function (plaintext, key) {
        const riv = new crypto.randomBytes(12);
        const cipher = crypto.createCipheriv('aes-256-gcm', key, riv);
        let enc1 = cipher.update(plaintext, 'utf8');
        let enc2 = cipher.final();
        const tag = cipher.getAuthTag();
        return Buffer.concat([riv, enc1, enc2, tag]).toString("base64");
    },
    decryptEkyc: function (ciphertext, key) {
        let enc = Buffer.from(ciphertext, 'base64');
        const iv = enc.slice(0, EKYC_GCM_IV_BYTE_LEN);
        const tag = enc.slice(enc.length - EKYC_GCM_TAG_BYTE_LEN);
        enc = enc.slice(EKYC_GCM_IV_BYTE_LEN, enc.length - EKYC_GCM_TAG_BYTE_LEN);
        const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
        decipher.setAuthTag(tag);
        let str = decipher.update(enc, null, 'utf8');
        str += decipher.final('utf8');
        return str;
    },
    encryption: function (plaintext, key) {
        return encrypt(plaintext, key);
    },

    decryption: function (ciphertext, key) {
        return decrypt(ciphertext, key);
    },
    encryptpgp: async function (data, publicKeyArmored, privateKeyArmored) {
        await openpgp.initWorker({ path: 'openpgp.worker.js' });

        const { keys: [privateKey] } = await openpgp.key.readArmored(privateKeyArmored);
        const { data: encrypted } = await openpgp.encrypt({
            message: openpgp.message.fromText(data.toString()),
            publicKeys: (await openpgp.key.readArmored(publicKeyArmored)).keys,
            privateKeys: [privateKey]
        });
        return encrypted
    },
    decryptpgp: async function (cipherText, privateKeyArmored, publicKeyArmored, options = {}) {
        await openpgp.initWorker({ path: 'openpgp.worker.js' });

        const { keys: [privateKey] } = await openpgp.key.readArmored(`${privateKeyArmored}`);
        const { data: decrypted } = await openpgp.decrypt({
            ...options,
            message: await openpgp.message.readArmored(cipherText),
            privateKeys: [privateKey],
            publicKeys: (await openpgp.key.readArmored(publicKeyArmored)).keys
        });
        try {
            return Buffer.from(JSON.parse(decrypted).data)
        } catch (error) {
            return decrypted
        }
    }
}

module.exports = Encryption;