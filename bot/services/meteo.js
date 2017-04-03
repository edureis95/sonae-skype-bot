const request = require('request-promise');

const appId = '612180c7acafaf536644f77c8b57f2ec';

/**
 * Converts Fahrenheit degrees to Celsius.
 * @param {*} f fahrenheit degrees
 * @return {*} celsius
 */
function toCelsius(f) {
    return (5 / 9) * (f - 32);
}

/**
 * Call Open Weather API to request the weather for today on a specific city of a country.
 * @param {*} city name of the city 
 * @param {*} country this is the code of the country
 * @return 
 */
function getWeatherByCityToday(city, country) {
    request('http://api.openweathermap.org/data/2.5/weather?q=' + city + ',' + country + '&appid=' + appId)
        .then(function (body) {
            const bodyParsed = JSON.parse(body);
            let respo = {
                description,
                main,
                min_temperature,
                max_temperature,
                humidity,
                wind_velocity
            };
            // send bodyParsed to respo var. see the documentation on the docs of open weather.
        })
        .catch(function (err) {

        });
}

module.exports = {};