const AuthenticationContext = require('adal-node').AuthenticationContext;
const request = require('request');
const O365Constants = require('./O365Constants.js');
const NodeCache = require("node-cache");
var myCache = new NodeCache();


module.exports = {
    acquireToken: function (callback) {
        myCache.get('token', function (error, value) {
            if (error || value == undefined) {
                var context = new AuthenticationContext(O365Constants.authorityUrl);
                context.acquireTokenWithClientCredentials(O365Constants.resource, O365Constants.clientId, O365Constants.clientSecret,
                    function (err, tokenResponse) {
                        if (err) {
                            return null;
                        } else {
                            myCache.set('token', tokenResponse.accessToken);
                            callback(tokenResponse.accessToken);
                        }
                    });
                return;
            }
            callback(value);
        });
    },
    bookMeeting: function (session, name, date, time, callback) {
        this.acquireToken(function (token) {
            bookMeeting(session, token, name, date, time, callback);
        });
    },
    userLocation: function (session, email, callback) {
        this.acquireToken(function (token) {
            userLocation(session, token, email, callback);
        });
    }
}

/**
 * Retrieves the user's location inside SONAE, which means, gets the user's office location, via a http request to office 365.
 * @param {Session} session session object
 * @param {String} token authentication token via v2.0
 * @param {String} email email of the logged user
 * @param {Function} callback callback function with the response parameter
 */
function userLocation(session, token, email, callback) {
    request(
        {
            url: 'https://graph.microsoft.com/v1.0/users/' + email + '/officeLocation',
            method: 'GET',
            json: true,
        })
        .on('error', function (err) {
            callback(err);
        })
        .on('response', function (response) {
            callback(response);
        });
}

function bookMeeting(session, token, name, date, time, callback) {

    var start = new Date(date + 'T' + time);
    var end = new Date(start.getTime() + 60 * 60000);
    request(
        {
            url: 'https://graph.microsoft.com/v1.0/users/mbotelho@parceiro.sonae.pt/calendar/events',
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: {
                'body': {
                    'contentType': 'text',
                    'content': 'Meeting with ' + name
                },
                'reminderMinutesBeforeStart': 1024,
                'responseRequested': true,
                'showAs': 'Busy',
                'start': {
                    'datetime': start,
                    'timezone': 'Europe/London'
                },
                'end': {
                    'datetime': end,
                    'timezone': 'Europe/London'
                },
                'subject': 'Booked Using Office Assistant Bot'
            },
            json: true
        })
        .on('error', function (err) {
            callback(err);
        })
        .on('response', function (response) {
            console.log('response');
            console.log(response);
            callback(response);
        });
}