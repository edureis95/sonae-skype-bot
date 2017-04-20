const builder = require('botbuilder');
const meteo = require('../services/meteo');
const office = require('../services/Office365Connection.js');
const google_vision = require('../services/google_vision.js');
const fs = require('fs');
const request = require('request');
var lib = new builder.Library('global_purpose');

lib.dialog('analyze_image', [

    function (session, args) {
        if (args && args.reprompt) {
            builder.Prompts.attachment(session, "O ficheiro que enviaste não é do tipo imagem. Tenta novamente.");
        } else {
            builder.Prompts.attachment(session, "Faz upload de uma imagem para eu analisar.");
        }
    },

    function (session, results) {

        if(hasImageAttachment(session)) {
            var attachment = session.message.attachments[0];

            var date = new Date();
            var t = date.getTime();

            const fileName = 'uploads/temp' + t + '.' + attachment.contentType.substring(6);

            //Save temp image file
            download(attachment.contentUrl, fileName, function () {
                google_vision.checkImage(fileName, function (caption) {
                    session.endDialog(caption);
                    //Delete temp image file
                    fs.unlink(fileName);
                });
            });
        } else {
            session.replaceDialog('analyze_image', { reprompt: true });
        }
}]);

lib.dialog('meteo/setLocation', [
    function (session) {
        builder.Prompts.text(session, "Qual a cidade que pretendes consultar?");
    },
    function (session, results) {
        if (results.response) {
            session.dialogData.city = results.response;
            meteo.getWeatherByCityOnDay(results.response, '', 0, function (resp) {
                session.dialogData.country = resp.split(/Retrieved: /)[1];
                location = [session.dialogData.city, session.dialogData.country]
                session.endDialogWithResult(location);
            });
        }

    }
]);

lib.dialog('meteo', [
    function (session, args, next) {
        session.dialogData.weather = args || {};
        office.userLocation(session, session.userData.email, function (data) {
            console.log(data.statusCode);
            // check if data returns anything than null, if not, set that response as session.dialogData.weather.country and continue to next dialog.

            if (!session.dialogData.weather.coutry)
                session.beginDialog('meteo/setLocation');
            else {
                next({ response: location });
            }
        });
    },
    function (session, results) {
        session.dialogData.weather.city = results[0];
        session.dialogData.weather.country = results[1];
        builder.Prompts.text(session, 'Encontrei ' + results[0] + ' ' + results[1] + '.\n É o que pretendes?').then;
    },
    function (session, results) {

        if (results.response) {
            if (results.response.toUpperCase() == 'N' || results.response.toUpperCase() == 'NAO' || results.response.toUpperCase() == 'NÃO')
                return session.endDialog("Tenta outra vez.");

            builder.Prompts.text(session, "Em que dia?");
        }
    },
    function (session, results) {

        if (results.response) {

            var day = results.response;
            if (day.toUpperCase() == 'HOJE')
                session.dialogData.weather.day = 0;
            else if (day.toUpperCase() == 'AMANHÃ' || day.toUpperCase() == 'AMANHA')
                session.dialogData.weather.day = 1;
            else
                return session.endDialog("Não consigo prever com esses parâmetros. Tenta outra vez.");

            meteo.getWeatherByCityOnDay(session.dialogData.weather.city, session.dialogData.weather.country, session.dialogData.weather.day, function (resp) {
                if (resp.morning.description == undefined && resp.afternoon.description == undefined && resp.evening.description == undefined)
                    return session.endDialog("Não existem dados disponíveis para esse dia.");

                var thumbnails = [];

                if (resp.morning.description != undefined) {
                    var card = new builder.ThumbnailCard(session)
                        .title(resp.city + '')
                        .subtitle('Manhã: ' + resp.morning.description)
                        .text(
                        'Temperatura: ' + resp.morning.temperature.toFixed(2) + ' ℃' + ' \r\n' +
                        'Temp Máx: ' + resp.morning.temperature_max.toFixed(2) + ' ℃' + ' \r\n' +
                        '\nTemp Min: ' + resp.morning.temperature_min.toFixed(2) + ' ℃' + ' \r\n' +
                        '\nHumidade: ' + resp.morning.humidity
                        )
                        .images([
                            builder.CardImage.create(session, 'https://openweathermap.org/img/w/' + resp.morning.icon + '.png')
                        ]);
                    thumbnails.push(card);

                }

                if (resp.afternoon.description != undefined) {
                    var card = new builder.ThumbnailCard(session)
                        .title(resp.city + '')
                        .subtitle('Tarde: ' + resp.afternoon.description)
                        .text(
                        'Temperatura: ' + resp.afternoon.temperature.toFixed(2) + ' ℃' + ' \r\n' +
                        'Temp Máx: ' + resp.afternoon.temperature_max.toFixed(2) + ' ℃' + ' \r\n' +
                        '\nTemp Min: ' + resp.afternoon.temperature_min.toFixed(2) + ' ℃' + ' \r\n' +
                        '\nHumidade: ' + resp.afternoon.humidity
                        )
                        .images([
                            builder.CardImage.create(session, 'https://openweathermap.org/img/w/' + resp.afternoon.icon + '.png')
                        ]);
                    thumbnails.push(card);

                }

                if (resp.evening.description != undefined) {
                    var card = new builder.ThumbnailCard(session)
                        .title(resp.city + '')
                        .subtitle('Noite: ' + resp.evening.description)
                        .text(
                        'Temperatura: ' + resp.evening.temperature.toFixed(2) + ' ℃' + ' \r\n' +
                        'Temp Máx: ' + resp.evening.temperature_max.toFixed(2) + ' ℃' + ' \r\n' +
                        '\nTemp Min: ' + resp.evening.temperature_min.toFixed(2) + ' ℃' + ' \r\n' +
                        '\nHumidade: ' + resp.evening.humidity
                        )
                        .images([
                            builder.CardImage.create(session, 'https://openweathermap.org/img/w/' + resp.evening.icon + '.png')
                        ]);
                    thumbnails.push(card);
                }


                var msg = new builder.Message(session)
                    .textFormat(builder.TextFormat.xml)
                    .attachments(thumbnails);
                session.endDialog(msg);
            });
        }
    }
]);

//=========================================================
// Utilities
//=========================================================

/**
 * Download file from url
 * @param {*} uri
 * @param {*} filename
 * @param {*} callback
 */
var download = function (uri, filename, callback) {
    request.head(uri, function (err, res, body) {
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);

        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};

function hasImageAttachment(session) {
    return session.message.attachments.length > 0 &&
        session.message.attachments[0].contentType.indexOf('image') !== -1;
}

// Export createLibrary() function
module.exports.createLibrary = function () {
    return lib.clone();
};