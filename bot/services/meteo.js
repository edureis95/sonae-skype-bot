"use strict";
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
 * Converts an UNIX TimeStamp to a date(day of the month) and an hour.
 * @param {UNIX_Timestamp} UNIX_timestamp  
 * @return {Object} time contains the hour and date
 */
function timeConverter(UNIX_timestamp) {
    const a = new Date(UNIX_timestamp * 1000);
    const date = a.getDate();
    const hour = a.getHours() - 1;
    let time = {
        date,
        hour,
    }
    return time;
}

/**
 * Call Open Weather API to request the weather for today on a specific city of a country.
 * This API is kind of tricky. It always sends a response back, even if the name is completely wrong, like a random character. Be aware of that.
 * It returns a JSON Object with a detailed description, a short one, humidity, wind_velocity, temperature and percentage of clouds.
 * @param {String} city name of the city 
 * @param {String} country code of the country (ex: pt, en, us, ...)
 * @param {Function} callback function with only one parameter, in which goes the JSON response
 */
function getWeatherByCityToday(city, country, next) {
    request('http://api.openweathermap.org/data/2.5/weather?q=' + city + ',' + country + '&appid=' + appId)
        .then(function (body) {
            const bodyParsed = JSON.parse(body);

            if (bodyParsed.sys.country.toUpperCase() != country.toUpperCase())
                next('Code given doesn\'t match the Open Weather API. Given: ' + country + ', Retrieved: ' + bodyParsed.sys.country);

            // this is the response object
            // FIXME: the descriptions are in english
            let respo = {
                description: bodyParsed.weather[0].description,
                short_description: bodyParsed.weather[0].main,
                humidity: bodyParsed.main.humidity + '%',
                wind_velocity: bodyParsed.wind.speed + ' metros/segundo',
                temperature: toCelsius(bodyParsed.main.temp),
                clouds: bodyParsed.clouds.all + '%',
                country: bodyParsed.name,
            }
            next(respo);
        })
        .catch(function (err) {
            next('Error calling OpenWeatherMap API. Error: ' + err.message);
        });
}

/**
 * Call Open Weather API to request the weather for today on a specific city of a country.
 * This API is kind of tricky. It always sends a response back, even if the name is completely wrong, like a random character. Be aware of that.
 * It returns a JSON Object with 3 objects inside it, morning, afternoon and evening, which one  with a detailed description, a short one, humidity, wind_velocity, temperature and percentage of clouds.
 * @param {String} city name of the city 
 * @param {String} country code of the country (ex: pt, en, us, ...)
 * @param {Number} day in which 0 is for today, 1 for tomorrow up until 4
 * @param {Function} callback function with only one parameter, in which goes the JSON response
 */
function getWeatherByCityOnDay(city, country, day, next) {
    request('http://api.openweathermap.org/data/2.5/forecast?q=' + city + ',' + country + '&appid=' + appId)
        .then(function (body) {
            const bodyParsed = JSON.parse(body);

            if (bodyParsed.city.country.toUpperCase() != country.toUpperCase())
                next('Code given doesn\'t match the Open Weather API. Given: ' + country + ', Retrieved: ' + bodyParsed.city.country);

            const dayToday = (new Date()).getDate();
            var reachedTime = false;

            // this is the response object
            var respo = {
                // 6 am to 12 pm
                morning: {
                    description: undefined,
                    short_description: undefined,
                    humidity: undefined,
                    wind_velocity: undefined,
                    temperature: undefined,
                    clouds: undefined,
                },
                // 12 pm to 6pm
                afternoon: {
                    description: undefined,
                    short_description: undefined,
                    humidity: undefined,
                    wind_velocity: undefined,
                    temperature: undefined,
                    clouds: undefined,
                },
                // 6pm to 12am
                evening: {
                    description: undefined,
                    short_description: undefined,
                    humidity: undefined,
                    wind_velocity: undefined,
                    temperature: undefined,
                    clouds: undefined,
                },
                city: bodyParsed.city.name,
            }

            // parses only the relevant information. it runs through a list and adds to the correct day, according to morning, afternoon and evening.
            // FIXME: the descriptions are in english
            for (let i = 0; i < bodyParsed.list.length; i++) {
                var time = timeConverter(bodyParsed.list[i].dt);
                if ((time.date - dayToday) === day) {
                    reachedTime = true;
                    // morning
                    if (time.hour === 9) {
                        respo.morning.description = bodyParsed.list[i].weather[0].description;
                        respo.morning.icon = bodyParsed.list[i].weather[0].icon;
                        respo.morning.short_description = bodyParsed.list[i].weather[0].main;
                        respo.morning.humidity = bodyParsed.list[i].main.humidity + '%';
                        respo.morning.wind_velocity = bodyParsed.list[i].wind.speed + ' metros/segundo';
                        respo.morning.temperature = toCelsius(bodyParsed.list[i].main.temp);
                        respo.morning.temperature_min = toCelsius(bodyParsed.list[i].main.temp_min);
                        respo.morning.temperature_max = toCelsius(bodyParsed.list[i].main.temp_max);
                        respo.morning.clouds = bodyParsed.list[i].clouds.all + '%';
                    }
                    // afternoon
                    else if (time.hour === 15) {
                        respo.afternoon.description = bodyParsed.list[i].weather[0].description;
                        respo.afternoon.icon = bodyParsed.list[i].weather[0].icon;
                        respo.afternoon.short_description = bodyParsed.list[i].weather[0].main;
                        respo.afternoon.humidity = bodyParsed.list[i].main.humidity + '%';
                        respo.afternoon.wind_velocity = bodyParsed.list[i].wind.speed + ' metros/segundo';
                        respo.afternoon.temperature = toCelsius(bodyParsed.list[i].main.temp);
                        respo.afternoon.temperature_min = toCelsius(bodyParsed.list[i].main.temp_min);
                        respo.afternoon.temperature_max = toCelsius(bodyParsed.list[i].main.temp_max);
                        respo.afternoon.clouds = bodyParsed.list[i].clouds.all + '%';
                    }
                    // evening
                    else if (time.hour === 21) {
                        respo.evening.description = bodyParsed.list[i].weather[0].description;
                        respo.evening.icon = bodyParsed.list[i].weather[0].icon;
                        respo.evening.short_description = bodyParsed.list[i].weather[0].main;
                        respo.evening.humidity = bodyParsed.list[i].main.humidity + '%';
                        respo.evening.wind_velocity = bodyParsed.list[i].wind.speed + ' metros/segundo';
                        respo.evening.temperature = toCelsius(bodyParsed.list[i].main.temp);
                        respo.evening.temperature_min = toCelsius(bodyParsed.list[i].main.temp_min);
                        respo.evening.temperature_max = toCelsius(bodyParsed.list[i].main.temp_max);
                        respo.evening.clouds = bodyParsed.list[i].clouds.all + '%';
                    }
                    // don't waste unnecessary time
                } else if (reachedTime) {
                    i = bodyParsed.list.length;
                }
            }
            next(respo);
        })
        .catch(function (err) {
            next('Error calling OpenWeatherMap API. Error: ' + err.message);
        });
}

module.exports = { getWeatherByCityToday, getWeatherByCityOnDay };