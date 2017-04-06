
/**
 * This file contains all the tests
 * related to FAQs dialogs
 */
require('dotenv-extended').load();
var assert = require('assert');
var request = require('request-promise');

/**
 * SONAE FAQs Tests
 */
var querySonaeFAQS = function(query, callback) {
  var options = {
    method: 'POST',
    uri: 'https://westus.api.cognitive.microsoft.com/qnamaker/v1.0//knowledgebases/'+ process.env.SONAE_FAQS_KBID + '/generateAnswer',
    headers: { 
      'Ocp-Apim-Subscription-Key': process.env.SONAE_FAQS_SUBKEY 
    },
    body: { 'question': query },
    json: true
  }

  request(options)
    .then(function (response) {
      callback(response);
    })
    .catch(function (err) { 
      console.log(err);
    })
};

describe('FAQs', function() {
    this.timeout(15000);
    describe('SONAE FAQs', function(done) {
       it('can query service', function (done) {
          querySonaeFAQS('hi', function(response) {
            assert.equal(response.answer, 'Hello');
            done();
          });
       });
       it('can avoid misleading answers', function(done) {
          querySonaeFAQS('social', function(response) {
            assert.equal(response.answer, 'Sede social ou capital social?');
            done();
          });
       });
       it('can obtain correct answers', function(done) {
          querySonaeFAQS('capital social', function(response) {
            assert.equal(response.answer, 'O capital social da Sonae totaliza 2.000 milh&#245;es de euros.');
            done();
          });
       });
    });
});

