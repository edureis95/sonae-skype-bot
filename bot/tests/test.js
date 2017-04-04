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