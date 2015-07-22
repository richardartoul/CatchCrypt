var crypto = require('crypto');
var config = require('./config');
var algorithm = config.encryptionAlgorithm;
var password = require('./encryptionPassword');

var encrypt = function(buffer) {
  var cipher = crypto.createCipher(algorithm, password);
  var encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  return encrypted;
}

var decrypt = function(buffer) {
  var decipher = crypto.createDecipher(algorithm, password);
  var decrypted = Buffer.concat([decipher.update(buffer), decipher.final()]);
  return decrypted;
}

exports.encrypt = encrypt;
exports.decrypt = decrypt;