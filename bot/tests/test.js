/**
 * Created by Miguel Botelho on 31/03/2017.
 * To run this module, one only needs to run 'npm test' on the command line.
 */

// This loads the environment variables from the .env file
require('dotenv-extended').load();
const assert = require('assert');
const sharepoint = require("../services/sharepoint/sharepoint");
const google_vision = require('../services/google_vision.js');

/**
 * This is only a test example.
 */
describe('Array', function () {
  this.timeout(15000);
  describe('#indexOf()', () => {
    it('should return -1 when the value is not present', () => {
      assert.equal(-1, [1, 2, 3].indexOf(4));
    });
  });
});

/**
 * Test retrievel of food menu URL from sharepoint
 */
describe('Test food menu', function () {
  this.timeout(15000);
  it('should return food menu url', function (done) {
     //todo alterar para o nome do ficheiro pretendido conforme
      let filename = "'exemplo.pdf'";
      sharepoint.getFileUrlFromSharePoint(filename, function (url) {
          //todo alterar url
          assert.equal(url, 'https://sonaesystems.sharepoint.com/sites/SonaeBot/Shared Documents/exemplo.pdf');
          done();
      });
  });
});


/**
 * Test retrievel of first step manual URL from sharepoint
 */
describe('Test first step manual', function () {
  this.timeout(15000);
  it('should return first steps manual url', function (done) {

      //todo alterar para o nome do ficheiro pretendido conforme
      let filename = "'exemplo.pdf'";
      sharepoint.getFileUrlFromSharePoint(filename, function (url) {
          //todo alterar url
          assert.equal(url, 'https://sonaesystems.sharepoint.com/sites/SonaeBot/Shared Documents/exemplo.pdf');
          done();
      });
  });
});

/**
 * Gets the caption from a specific image using the Google Vision API.
 */
describe('Tests the connection to the Google Vision API', function () {
    this.timeout(15000);
    it('should return Beagle', function (done) {
        google_vision.checkImage('bot/tests/Beagle.JPG', function(caption) {
            assert.equal(caption, 'Beagle');
            done();
        });
    });
 
    it('should return Jade Belt Bridge', function (done) {
        google_vision.checkImage('bot/tests/Bridge.jpg', function(caption) {
            assert.equal(caption, 'Jade Belt Bridge');
            done();
        });
    });
});

