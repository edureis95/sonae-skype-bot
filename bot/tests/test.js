
/**
 * This file contains all the tests
 * related to Bing API service
 */

/* global define, it, describe */
require('dotenv-extended').load();
const assert = require('assert');
const request = require('request-promise');

/**
 * BING API Tests Definitions
 */
const findRoute = function (source, destination, callback) {
  const options = {
    method: 'POST',
    uri: 'http://dev.virtualearth.net/REST/V1/Routes/Driving?o=json&wp.0'+ source +'&wp.1='+ destination + '&avoid=minimizeTolls&key=' + process.env.BING_MAPS_API_KEY,
  };

  request(options)
    .then((response) => {
      callback(response);
    })
    .catch((err) => {
      console.log(err);
    });
};

/**
 * Tests
 */

describe('BING API', function () {
  this.timeout(15000);
  it('can calculate routes', (done) => {
    findRoute('porto', 'penafiel', (response) => {
        console.log("EU AQUI");
        assert.equal(response.routeLegs.actualEnd.coordinates[0], 41.21012);
        done();
    });
  });
});