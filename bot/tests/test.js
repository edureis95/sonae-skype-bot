/**
 * Created by Miguel Botelho on 31/03/2017.
 * To run this module, one only needs to run 'npm test' on the command line.
 */
const assert = require('assert');
const captionService = require('../services/caption-service');
const needle = require('needle');

/**
 * Gets the caption from a specific image using the Vision API.
 */
describe('Tests the connection to the Vision API', function () {
    this.timeout(15000);
    it('should return Lebron James', function (done) {
        var headers = {};
        headers['Content-Type'] = 'image/png';
        var stream = needle.get('http://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/1966.png&w=350&h=254', { headers: headers });
        captionService.getCaptionFromStream(stream).then(function (caption) {
            assert.equal(caption, 'LeBron James that is posing for a picture');
            done();
        });
    });
 
    it('should return Cristiano Ronaldo', function (done) {
        var headers = {};
        headers['Content-Type'] = 'image/png';
        var stream = needle.get('https://s-media-cache-ak0.pinimg.com/originals/50/d4/a3/50d4a3ba96253b15febc42caf163e072.jpg', { headers: headers });
        captionService.getCaptionFromStream(stream).then(function (caption) {
            assert.equal(caption, 'Cristiano Ronaldo is smiling at the camera');
            done();
        });
    });
});

