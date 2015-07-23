/*TODO: 
1) look into file permissions / how to make sure no files that are uploaded ever get executed
2) add logging functionality instead of console logging
3) Need a test to verify that links become unavailable 24 hours after encryption
4) Right now links expire after 24 hours, bu files are not removed - could take care of this with a cronjob or something.
*/

var config = require('./config');
var errorHandler = require('./errorHandler');
var fs = require('fs');
var db = require('./db');
var encryption = require('./encryption');

//microframework that makes creating servers in Node easier
var express = require('express');
var port = process.env.port || 3000;

//middle-ware for handling multipart/form-data --- makes handling file uploads easier
var multer = require('multer');
//configured options to help prevent DOS attacks --- see config file for description of each parameter
var upload = multer({
  dest: config.uploadDestination,
  /* multer will store file uploads in memory instead of comitting them directly to disk --- this is so they can be encrypted before ever being stored on disk */
  storage: multer.memoryStorage(),
  limits: {
    fields: config.numFields,
    fileSize: config.maxFileSize,
    files: config.numFiles,
  }
});

//encryption setup
var crypto = require('crypto');
var algorithm = config.encryptionAlgorithm;
var password = require('./encryptionPassword');

var app = express();

/* route for uploading files, the uplodate.single() function is middleware that will parse the multipart form, store the file in the appropriate folder, and add a property called file to the req argument that can be used to access information about the uploaded file */
app.post('/api/upload', upload.single('userFile'), function(req, res) {
  var newFile = new db.fileModel();
  newFile.name = req.file.originalname;
  newFile.save(function(err, insertedFile) {
    var folderPath = './upload/' + insertedFile._id
    var filePath = folderPath + '/' + insertedFile.name;
    fs.mkdir(folderPath, function(err) {
      if (err) throw err;
      fs.writeFile(filePath, encryption.encrypt(req.file.buffer), function(err) {
        if (err) throw err;
        res.status(201).send({uploadId: insertedFile._id});
      });
    })
  });
});

app.get('/api/:uploadId', function(req, res) {
  db.fileModel.find({_id: req.params.uploadId}, function(err, foundFile) {
    if (foundFile && foundFile.length > 0) {
      foundFile = foundFile[0];
      /* Allows the links to expire after a certain period of time. Substracting the two dates will return an integer that represents the number of milliseconds that elapsed between the two different timestamps. The number of milliseconds can be divided by 1000, 60, and then 60 again to get the difference in hours */
      if (((Date.now() - foundFile.date)/1000/60/60) > config.linkExpireInHours) {
        return res.status(400).send('Link expired!');
      } 
      var filePath = './upload/' + foundFile._id + '/' + foundFile.name;
      console.log(filePath);
      fs.readFile(filePath, function (err,data) {
        if (err) {
          return res.status(404).send('File not found!');
        }
        res.setHeader('Content-disposition', 'attachment; filename=' + foundFile.name);
        res.status(200).send(encryption.decrypt(data));
      });
    }
    else {
      return res.status(404).send('File not found!');
    }
  });
});

//error handling middleware applied last
app.use(errorHandler);

//start server
var server = app.listen(port, function() {
  console.log("Express server listening on %d in %s mode", port, app.settings.env);
});