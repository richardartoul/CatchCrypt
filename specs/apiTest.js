var request = require('supertest');
var should = require('should');

describe('API', function() {
  describe('upload', function() {
    var agent;
    beforeEach(function(done) {
      agent = request.agent('0.0.0.0:3000');
      done();
    });

    it('should store uploaded files', function(done) {
      agent.post('/api/upload').attach('userFile', './specs/testImage.jpg')
      .expect(201)
      .end(function(err, response) {
        if (err) throw err;
        response.body.uploadId.should.exist;
        done();
      });
    });
  });
});