var db = require('../db');
var fs = require('fs');
var isExpired = require('./utils/isExpired');
var config = require('../config');
var encryption = require('../encryption');

module.exports = function(req, res) {
  //check if file is in database
  db.fileModel.find({_id: req.params.uploadId}, function(err, foundFile) {
    if (foundFile && foundFile.length > 0) {
      //find returns an array so grab first index
      foundFile = foundFile[0];
      //Causes the links to expire after a certain period of time.
      if (isExpired(Date.now(), foundFile.date, config.linkExpireInHours)) {
        return res.status(400).send('Link expired');
      }
      var filePath = './upload/' + foundFile._id + '/' + foundFile.name;
      fs.readFile(filePath, function (err,data) {
        if (err) {
          return res.status(404).send('File not found!');
        }
        //notifies browser of the proper filename and that it should be interpreted as a file download
        res.setHeader('Content-disposition', 'attachment; filename=' + foundFile.name);
        //decrypt buffer before sending
        res.status(200).send(encryption.decrypt(data));
      });
    }
    else {
      return res.status(404).send('File not found!');
    }
  });
};