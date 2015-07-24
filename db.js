//Db connection
var mongoose = require('mongoose');
var config = require('./config');
mongoose.connect(config.dbAddress);

var FileSchema = new mongoose.Schema({
  //max password length is 20 characters
  password: {type: String, max: 20},
  name: {type: String, max:100},
  date: {type: Date, default: Date.now}
});

var fileModel = mongoose.model('File', FileSchema);

exports.fileModel = fileModel;
exports.mongoose = mongoose;




