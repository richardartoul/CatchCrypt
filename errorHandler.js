//simple error handling --- the upload middleware delegates errors to Express, so errors in that process will be handled by this function as well
module.exports = function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Server encountered an internal error');
}