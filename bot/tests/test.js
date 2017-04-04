/**
 * Created by Miguel Botelho on 31/03/2017.
 * To run this module, one only needs to run 'npm test' on the command line.
 */
const assert = require('assert');
const meteo = require('../services/meteo.js');

/**
 * This is only a test example.
 */
describe('Array', function () {
    this.timeout(15000);
    describe('#indexOf()', function () {
        it('should return -1 when the value is not present', function () {
            assert.equal(-1, [1, 2, 3].indexOf(4));
        });
    });
});


/**
 * 
 */
describe('Tests the connection to OpenWeatherMap API', function () {
    this.timeout(15000);
    it('should return porto', function () {
        meteo.getWeatherByCityToday('porto', 'pt', function (porto_meteo) {
            console.log(porto_meteo);
            assert.equal(porto_meteo.name, 'porto');
        });
    });
});