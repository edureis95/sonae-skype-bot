
/**
 * This file contains all the tests
 * related to FAQs dialogs
 */

/* global define, it, describe */
require('dotenv-extended').load();
const assert = require('assert');
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
    });
  });
});

