var request = require('supertest');
var should = require('should');
var fs = require('fs');
var deleteFile = require('./utils/deleteFile');
var testFile = 'testImage.jpg';

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
        deleteFile(uploadId, testFile, done);
      });
    });

    it('should respond appropriately if no file is attached', function(done) {
      agent.post('/api/upload')
      .expect(400)
      .end(function(err, response) {
        if (err) throw err;
        response.text.should.equal('You must submit a file!');
        done();
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
          deleteFile(uploadId, testFile, done);
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

  describe('password', function() {
    var agent;
    beforeEach(function(done) {
      agent = request.agent('0.0.0.0:3000');
      done();
    })

    it('should retrieve a file that was stored with a password if the client provides the right password', function(done) {
      var uploadId;
      agent.post('/api/upload')
      .attach('userFile', './specs/testImage.jpg')
      .type('form')
      .field('password', 'hi')
      .send()
      .expect(201)
      .end(function(err, response) {
        uploadId = response.body.uploadId;
        agent.get('/api/' + uploadId)
        .query({password: 'hi'})
        .expect(200)
        .end(function(err, response) {
          if (err) throw err;
          response.text.should.not.eql({});
          response.text.should.not.equal('File not found!');
          response.text.should.not.equal('Password required to retrieve this file!');
          response.text.should.not.equal('Wrong password!');
          deleteFile(uploadId, testFile, done);
        });
      });
    });

    it('should direct user to enter password if one is not provided for a password protected file', function(done) {
      var passwordHtml;
      //get the html for the password page that the server should send back, then make the ajax requests
      fs.readFile('./apiInterface/password.html', {encoding: 'utf-8'}, function(err, data) {
        if (err) throw err;
        passwordHtml = data;
        var uploadId;
        agent.post('/api/upload')
        .attach('userFile', './specs/testImage.jpg')
        .type('form')
        .field('password', 'hi')
        .send()
        .expect(201)
        .end(function(err, response) {
          uploadId = response.body.uploadId;
          agent.get('/api/' + uploadId)
          .expect(400)
          .end(function(err, response) {
            if (err) throw err;
            response.text.should.equal(passwordHtml);
            deleteFile(uploadId, testFile, done);
          });
        });
      });
    });

    it('should not retrieve a file that was stored with a password if the client provides the wrong password', function(done) {
      var uploadId;
      agent.post('/api/upload')
      .attach('userFile', './specs/testImage.jpg')
      .type('form')
      .field('password', 'hi')
      .send()
      .expect(201)
      .end(function(err, response) {
        uploadId = response.body.uploadId;
        agent.get('/api/' + uploadId)
        .query({password: 'yo'})
        .expect(400)
        .end(function(err, response) {
          if (err) throw err;
          response.text.should.equal('Wrong password!');
          deleteFile(uploadId, testFile, done);
        });
      });
    });
  });
});