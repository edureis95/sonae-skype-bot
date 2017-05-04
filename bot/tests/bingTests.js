
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
    method: 'GET',
    uri: `http://dev.virtualearth.net/REST/V1/Routes/Driving?o=json&wp.0=${source}&wp.1=${destination}&avoid=minimizeTolls&key=AqNgdqQRbHbTI1C4i8R1drdqiKJ5u9bDgeJr1HxvdghjFewRCPln1YUzORPEYdf-`,
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
      const jsonResponse = JSON.parse(response);
      assert.equal(
        jsonResponse.resourceSets[0].resources[0].routeLegs[0].actualEnd.coordinates[0],
        41.21012
      );
      done();
    });
  });
});
