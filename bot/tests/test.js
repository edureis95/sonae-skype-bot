/**
 * Created by Miguel Botelho on 31/03/2017.
 * To run this module, one only needs to run 'npm test' on the command line.
 */
const assert = require('assert');
const global_purpose = require('../dialogs/global_purpose.js')

/**
 * Gets the caption from a specific image using the Google Vision API.
 */
describe('Tests the connection to the Google Vision API', function () {
    this.timeout(15000);
    it('should return Beagle', function (done) {
        global_purpose.checkImage('bot/tests/Beagle.JPG', function(caption) {
            assert.equal(caption, 'Beagle');
            done();
        });
    });
 
    it('should return Jade Belt Bridge', function (done) {
        global_purpose.checkImage('bot/tests/Bridge.jpg', function(caption) {
            assert.equal(caption, 'Jade Belt Bridge');
            done();
        });
    });
});

