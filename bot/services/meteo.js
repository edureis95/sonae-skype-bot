const request = require('request-promise');

const appId = '612180c7acafaf536644f77c8b57f2ec';

/**
 * Converts Kelvin degrees to Celsius.
 * @param {Number} f kelvin degrees
 * @return {Number} celsius celsius degrees
 */
function toCelsius(f) {
    return f - 273.15;
}

/**
 * Call Open Weather API to request the weather for today on a specific city of a country.
 * This API is kind of tricky. It always sends a response back, even if the name is completely wrong, like a random character. Be aware of that.
 * @param {String} city name of the city 
 * @param {String} country code of the country (ex: pt, en, us, ...)
 * @param {Function} callback function with only one parameter, in which goes the JSON response
 */
function getWeatherByCityToday(city, country, next) {
    request('http://api.openweathermap.org/data/2.5/weather?q=' + city + ',' + country + '&appid=' + appId)
        .then(function (body) {
            const bodyParsed = JSON.parse(body);
            // send bodyParsed to respo var. see the documentation on the docs of open weather.
            
            if (bodyParsed.sys.country != country)
                next('Code given doesn\'t match the Open Weather API. Given: ' + country + ', Retrieved: ' + bodyParsed.sys.country);

            let respo = {
                description : bodyParsed.weather[0].description,
                short_description : bodyParsed.weather[0].main,
                humidity : bodyParsed.main.humidity + '%',
                wind_velocity : bodyParsed.wind.speed + 'meters/second',
                temperature : toCelsius(bodyParsed.main.temp),
                clouds : bodyParsed.clouds.all + '%',
            }
            next(respo);
        })
        .catch(function (err) {
            next('Error calling OpenWeatherMap API. Error: ' + err.message);
        });
}

module.exports = {getWeatherByCityToday};