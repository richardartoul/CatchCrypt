var fs = require('fs');
module.exports = function() {
  fs.mkdir('./upload', function(err, data) {
    if (err) console.log(err);
  });
}