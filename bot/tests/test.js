/**
 * This file contains all the tests
 * related to FAQs dialogs
 */

// This loads the environment variables from the .env file
require('dotenv-extended').load();
const assert = require('assert');
const meteo = require('../services/meteo.js');
const sharepoint = require("../services/sharepoint/sharepoint");
const google_vision = require('../services/google_vision.js');
const request = require('request-promise');

/**
 * SONAE FAQs Tests
 */

const querySonaeFAQS = function (query, callback) {
  const options = {
    method: 'POST',
    uri: `https://westus.api.cognitive.microsoft.com/qnamaker/v1.0//knowledgebases/${process.env.SONAE_FAQS_KBID}/generateAnswer`,
    headers: {
      'Ocp-Apim-Subscription-Key': process.env.SONAE_FAQS_SUBKEY,
    },
    body: { question: query },
    json: true,
  };

  request(options)
    .then((response) => {
      callback(response);
    })
    .catch((err) => {
      console.log(err);
    });
};

describe('FAQs', function () {
  this.timeout(15000);
  describe('SONAE FAQs', () => {
    it('can query service', (done) => {
      querySonaeFAQS('hi', (response) => {
        assert.equal(response.answer, 'Hello');
        done();
      });
    });
    it('can avoid misleading answers', (done) => {
      querySonaeFAQS('social', (response) => {
        assert.equal(response.answer, 'Sede social ou capital social?');
        done();
      });
    });
    it('can obtain correct answers', (done) => {
      querySonaeFAQS('capital social', (response) => {
        assert.equal(response.answer, 'O capital social da Sonae totaliza 2.000 milh&#245;es de euros.');
        done();
      });

describe('Array', function () {
    this.timeout(15000);
    describe('#indexOf()', function () {
        it('should return -1 when the value is not present', function (done) {
            assert.equal(-1, [1, 2, 3].indexOf(4));
            done();
        });
    });
});


/**
 * Gets the weather for today, on Porto, Portugal.
 */
describe('Tests the connection to OpenWeatherMap API', function () {
    this.timeout(15000);
    it('should return porto', function (done) {
        meteo.getWeatherByCityToday('porto', 'pt', function (weather) {
            assert.equal(weather.country.toLowerCase(), 'porto');
            done();
        });
    });
});

/**
 * Gets the weather for a specific day, for Valencia, Spain.
 */
describe('Tests the connection to OpenWeatherMap API', function () {
    this.timeout(15000);
    it('should return the wrong country', function (done) {
        meteo.getWeatherByCityToday('din12iesainkasdni', 'es', function (weather) {
            assert.notEqual(weather.country, 'din12iesainkasdni');
            done();
        });
    });
});

/**
 * Gets the weather for a specific day, for Valencia, Spain.
 */
describe('Tests the connection to OpenWeatherMap API', function () {
    this.timeout(15000);
    it('should return valencia', function (done) {
        meteo.getWeatherByCityOnDay('valencia', 'es', 2, function (weather) {
            assert.equal(weather.country.toLowerCase(), 'valencia');
            done();
        });
    });
});

/**
 * Gets the weather for a specific day, for Valencia, Spain.
 */
describe('Tests the connection to OpenWeatherMap API', function () {
    this.timeout(15000);
    it('should return the wrong country', function (done) {
        meteo.getWeatherByCityOnDay('din12iesainkasdni', 'es', 2, function (weather) {
            assert.notEqual(weather.country, 'din12iesainkasdni');
            done();
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