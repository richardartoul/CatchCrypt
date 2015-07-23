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
// var parser = require('body-parser');

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

var app = express();
//deliver the api interface
app.use(express.static(__dirname + '/apiInterface'));

/* route for uploading files, the uplodate.single() function is middleware that will parse the multipart form, store the file in the appropriate folder, and add a property called file to the req argument that can be used to access information about the uploaded file */
var uploadFileHandler = require('./routeHandlers/uploadFile');
app.post('/api/upload', upload.single('userFile'), uploadFileHandler);

//route for retrieving files --- this is how the links work
var getFileHandler = require('./routeHandlers/getFile');
app.get('/api/:uploadId', getFileHandler);

//error handling middleware applied last
app.use(errorHandler);

//start server
var server = app.listen(port, function() {
  console.log("Express server listening on %d in %s mode", port, app.settings.env);
});