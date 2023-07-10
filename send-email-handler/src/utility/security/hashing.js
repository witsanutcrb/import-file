const crypto = require('crypto');
var hashing = function () {

}

function digest(plaintext, algorithm) {
    return crypto.createHash(algorithm).update(plaintext).digest('hex');
}

hashing.prototype = {

    md5: function (plaintext) {
        return digest(plaintext, 'md5');
    },

    sha1: function (plaintext) {
        return digest(plaintext, 'sha1');
    },

    sha256: function (plaintext) {
        return digest(plaintext, 'sha256');
    },

    sha384: function (plaintext) {
        return digest(plaintext, 'sha384');
    },

    sha224: function (plaintext) {
        return digest(plaintext, 'sha224');

    },
    whirlpool: function (plaintext) {
        return digest(plaintext, 'whirlpool');
    }
}

module.exports = hashing;