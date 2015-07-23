var fs = require('fs');
module.exports = function(id, name, callback) {
  fs.unlink('./upload/' + id + '/' + name, function(err) {
    if (err) throw err;
    fs.rmdir('./upload/' + id, callback);
  });
}
