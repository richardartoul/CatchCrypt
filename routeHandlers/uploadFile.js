var db = require('../db');
var fs = require('fs');
var encryption = require('../encryption');
var saltAndHash = require('./utils/saltAndHash');

//helper function that inserts a record of the file into the database, then encrypts the buffer and writes it to disk.
var saveFile = function(req, res, newFile) {
  newFile.save(function(err, insertedFile) {
    var folderPath = './upload/' + insertedFile._id
    var filePath = folderPath + '/' + insertedFile.name;
    fs.mkdir(folderPath, function(err) {
      if (err) throw err;
      //encrypt buffer before writing to disk
      fs.writeFile(filePath, encryption.encrypt(req.file.buffer), function(err) {
        if (err) throw err;
        /* send the client a link to their uploaded file, req.headers.host refers to the host of the server (dynamic so that it works locally and once its deployed on a foreign server */
        res.status(201).send({'uploadId': insertedFile._id});
      });
    });
  });
};

module.exports = function(req, res) {
  if (!req.file) {
    return res.status(400).send('You must submit a file!');
  }
  var newFile = new db.fileModel();
  newFile.name = req.file.originalname;
  if (req.body.password) {
    saltAndHash(req.body.password, function(hashedPassword) {
      newFile.password = hashedPassword;
      saveFile(req, res, newFile);
    });
  }
  else {
    saveFile(req, res, newFile);
  }
};