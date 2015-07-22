var request = require('supertest');
var should = require('should');
var fs = require('fs');

describe('API', function() {
  describe('upload', function() {
    var agent;
    beforeEach(function(done) {
      agent = request.agent('0.0.0.0:3000');
      done();
    });

    it('should store uploaded files', function(done) {
      var uploadId;
      agent.post('/api/upload').attach('userFile', './specs/testImage.jpg')
      .expect(201)
      .end(function(err, response) {
        if (err) throw err;
        response.body.uploadId.should.exist;
        uploadId = response.body.uploadId;
        fs.unlink('./upload/' + uploadId, done);
      });
    });
  });

  describe('download', function() {
    var agent;
    beforeEach(function(done) {
      agent = request.agent('0.0.0.0:3000');
      done();
    });

    it('should send files if they exist', function(done) {
      var uploadId;
      agent.post('/api/upload').attach('userFile', './specs/testImage.jpg')
      .expect(201)
      .end(function(err, response) {
        uploadId = response.body.uploadId;
        agent.get('/api/' + uploadId)
        .expect(200)
        .end(function(err, response) {
          if (err) throw err;
          response.text.should.not.eql({});
          response.text.should.not.equal('File not found!');
          fs.unlink('./upload/' + uploadId, done);
        });
      });
    });

    it('should send users an error if the file does not exist', function(done) {
      agent.get('/api/123')
      .expect(404)
      .end(function(err, response) {
        if (err) throw err;
        response.text.should.equal('File not found!');
        done();
      });
    });
  });
});