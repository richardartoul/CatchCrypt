/*TODO: 
1) look into file permissions / how to make sure no files that are uploaded ever get executed
2) add logging functionality instead of console logging
*/

var config = require('./config');
var errorHandler = require('./errorHandler');

//microframework that makes creating servers in Node easier
var express = require('express');
var port = process.env.port || 3000;

//middle-ware for handling multipart/form-data --- makes handling file uploads easier
var multer = require('multer');
//configured options to help prevent DOS attacks --- see config file for description of each parameter
var upload = multer({
  dest: config.uploadDestination,
  limits: {
    fields: config.numFields,
    fileSize: config.maxFileSize,
    files: config.numFiles,
  }
});

var app = express();

//error handling middleware applied last
app.use(errorHandler);

/* route for uploading files, the uplodate.single() function is middleware that will parse the multipart form, store the file in the appropriate folder, and add a property called file to the req argument that can be used to access information about the uploaded file */
app.post('/api/upload', upload.single('userFile'), function(req, res) {
  res.status(201).send({uploadId: req.file.filename});
});

//start server
var server = app.listen(port, function() {
  console.log("Express server listening on %d in %s mode", port, app.settings.env);
});