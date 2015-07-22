var encryption = require('../encryption');
var fs = require('fs');

//unit tests for the encryption/decryption functions - verify that a file can be encrypted and then properly decrypted
describe('encryption', function() {
  describe('encrypt()', function() {
    //This test is a little crude, basically checks to see if the return buffer is different than the original
    it('should return an encrypted buffer', function(done) {
      fs.readFile('./specs/testImage.jpg', function(err, buffer) {
        if (err) throw err;
        var encryptedBuffer = encryption.encrypt(buffer);
        encryptedBuffer.should.not.eql(buffer);
        done();
      });
    });
  });

  describe('decrypt()', function() {
    it('should decrypt an encrypted buffer', function(done) {
      fs.readFile('./specs/testImage.jpg', function(err, buffer) {
        if (err) throw err;
        var encryptedBuffer = encryption.encrypt(buffer);
        var decryptedBuffer = encryption.decrypt(encryptedBuffer);
        buffer.should.eql(decryptedBuffer);
        done();
      });
    })
  });
});