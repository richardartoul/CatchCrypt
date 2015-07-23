var db = require('../db');
var fs = require('fs');
var isExpired = require('./utils/isExpired');
var config = require('../config');
var encryption = require('../encryption');
var bcrypt = require('bcrypt');

//helper function that reads file from disk and sends it to client
var sendFile = function(req, res, file) {
  var filePath = './upload/' + file._id + '/' + file.name;
  fs.readFile(filePath, function (err,data) {
    if (err) {
      return res.status(404).send('File not found!');
    }
    //notifies browser of the proper filename and that it should be interpreted as a file download
    res.setHeader('Content-disposition', 'attachment; filename=' + file.name);
    //decrypt buffer before sending
    res.status(200).send(encryption.decrypt(data));
  });
};

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

      //If file was submitted with a password, password is required to retrieve the file
      if (foundFile.password) {
        if (!req.query.password) {
          //delivers an html file that will request the user for the password and then download the file
          res.status(400).sendfile('./apiInterface/password.html');
        }
        //If file requires a password AND a password is provided, compare them to make sure that they match before delivering file.
        else if (req.query.password) {
          bcrypt.compare(req.query.password, foundFile.password, function(err, same) {
            if (same) {
              sendFile(req, res, foundFile);
            }
            else {
              res.status(400).send('Wrong password!');
            }
          });
        }
      }
      //if file doesn't require a password
      else {
        sendFile(req, res, foundFile);
      }
    }
    else {
      return res.status(404).send('File not found!');
    }
  });
};