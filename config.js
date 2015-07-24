module.exports = {
  /* ---- upload settings ---- */
  uploadDestination: './upload',
  //max number of fields per form
  numFields: 10,
  //this is in bytes --> 5 megabytes
  maxFileSize: 5000000,
  //max number of files to upload per form
  numFiles: 1,
  /* ---- encryption settings ---- */
  encryptionAlgorithm: 'aes-256-ctr',
  /* ---- link settings ---- */
  linkExpireInHours: 24,
  /* ---- security settings ---- */
  //number of times to run bcrypt algorithm when generating salt
  bcryptRepeat: 10,
  /* ---- database settings ----- */
  dbAddress: 'mongodb://localhost/encryptapi'
}