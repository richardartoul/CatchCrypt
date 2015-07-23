var bcrypt = require('bcrypt');
module.exports = function(password) {
  bcrypt.genSalt(config.bcryptRepeat, function(err, salt) {
    bcrypt.hash(password, salt, function(err, hash) {
      callback(hash);
    });
  });
}