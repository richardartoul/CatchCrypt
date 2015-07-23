var bcrypt = require('bcrypt');
var config = require('../../config');
module.exports = function(password, callback) {
  bcrypt.genSalt(config.bcryptRepeat, function(err, salt) {
    bcrypt.hash(password, salt, function(err, hash) {
      callback(hash);
    });
  });
}