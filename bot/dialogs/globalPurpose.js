

const builder = require('botbuilder');
const meteo = require('../services/meteo');
const office = require('../services/Office365Connection.js');
const google_vision = require('../services/googleVision.js');
const fs = require('fs');
const request = require('request');
const bing = require('bing');

const lib = new builder.Library('global_purpose');
const sharepoint = require('../services/sharepoint/sharepoint');

lib.dialog('options', [
    function (session) {
        session.preferredLocale('pt');
        builder.Prompts.choice(
            session,
            'O que queres saber?',
            ['Ementa', 'Manual de Primeiros Passos da Sonae', 'FAQs da Sonae', 'Tempo', 'Direções', 'Análise Imagem'],
            {
                maxRetries: 0,
                listStyle: 3
            }
        );
    },
    function (session, result) {
        if (!result.response) {
            // exhausted attemps and no selection, start over
            switch (session.message.text.toLowerCase()) {
                case 'ajuda':
                    return session.beginDialog('other:help');
                case 'ementa':
                    return session.beginDialog('global_purpose:foodMenu');
                case 'análise imagem':
                    return session.beginDialog('global_purpose:analyze_image');
                case 'tempo':
                    return session.beginDialog('global_purpose:meteo');
                case 'faqs':
                    return session.beginDialog('faqs:sonae-faqs');
                case 'direções':
                    return session.beginDialog('global_purpose:directions');
                default:
                    return session.send('Não percebi. Tenta escrever \'Ajuda\' para saberes como te posso ajudar.');
            }
            return session.endDialog();
        }

        // on error, start over
        session.on('error', (err) => {
            session.send('Failed with message: %s', err.message);
            session.endDialog();
        });

        // continue on proper dialog
        const selection = result.response.entity;
        switch (selection) {
            case 'Ementa':
                return session.beginDialog('global_purpose:foodMenu');
            case 'Manual de Primeiros Passos da Sonae':
                return session.beginDialog('global_purpose:firstStepsManual');
            case 'FAQs da Sonae':
                return session.beginDialog('faqs:sonae-faqs');
            case 'Tempo':
                return session.beginDialog('global_purpose:meteo');
            case 'Direções':
                return session.beginDialog('global_purpose:directions');
            case 'Análise Imagem':
                return session.beginDialog('global_purpose:analyze_image');
            default:
                break;
        }
    },
]);

lib.dialog('foodMenu', [
    function (session) {
        // todo alterar para o nome do ficheiro pretendido conforme
        const filename = "'exemplo.pdf'";

        sharepoint.getFileUrlFromSharePoint(filename, (url) => {
            if (url === null) {
                return session.endDialog("Error retrieving file's URL.");
            }

            const contentType = 'application/pdf';

            const msg = new builder.Message(session)
                .addAttachment({
                    contentUrl: url,
                    contentType,
                    name: 'Clica aqui para veres a ementa.',
                });

            session.send(msg);
            session.replaceDialog('start:startMessage', { reprompt: true });
        });
    },
]);

lib.dialog('firstStepsManual', [
    function (session) {
        // todo alterar para o nome do ficheiro pretendido conforme
        const filename = "'exemplo.pdf'";

        sharepoint.getFileUrlFromSharePoint(filename, (url) => {
            if (url === null) {
                return session.endDialog("Error retrieving file's URL.");
            }

            const contentType = 'application/pdf';

            const msg = new builder.Message(session)
                .addAttachment({
                    contentUrl: url,
                    contentType,
                    name: 'Clica aqui para veres o manual de primeiros passos na Sonae.',
                });

            session.send(msg);
            session.replaceDialog('start:startMessage', { reprompt: true });
        });
    },
]);

lib.dialog('analyze_image', [

    function (session, args) {
        if (args && args.reprompt) {
            builder.Prompts.attachment(session, 'O ficheiro que enviaste não é do tipo imagem. Tenta novamente.');
        } else {
            builder.Prompts.attachment(session, 'Faz upload de uma imagem para eu analisar.');
        }
    },

    function (session, results) {
        if (hasImageAttachment(session)) {
            const attachment = session.message.attachments[0];

            const date = new Date();
            const t = date.getTime();

            const fileName = `uploads/temp${t}.${attachment.contentType.substring(6)}`;

            // Save temp image file
            download(attachment.contentUrl, fileName, () => {
                google_vision.checkImage(fileName, (caption) => {
                    session.send(caption);
                    session.replaceDialog('start:startMessage', { reprompt: true });
                    // Delete temp image file
                    fs.unlink(fileName);
                });
            });
        } else {
            session.replaceDialog('analyze_image', { reprompt: true });
        }
    }]);

lib.dialog('meteo/setLocation', [
    function (session) {
        builder.Prompts.text(session, 'Qual a cidade que pretendes consultar?');
    },
    function (session, results) {
        if (results.response) {
            session.dialogData.city = results.response;
            meteo.getWeatherByCityOnDay(results.response, '', 0, (resp) => {
                session.dialogData.country = resp.split(/Retrieved: /)[1];
                const location = [session.dialogData.city, session.dialogData.country];
                session.endDialogWithResult(location);
            });
        }
    },
]);

lib.dialog('meteo', [
    function (session, args, next) {
        session.dialogData.weather = args || {};
        office.userLocation(session, session.userData.email, (data) => {
            console.log(data.statusCode);
            // check if data returns anything than null, if not, set that response as session.dialogData.weather.country and continue to next dialog.

            if (!session.dialogData.weather.coutry) {
                session.beginDialog('meteo/setLocation');
            }            else {
                next({ response: location });
            }
        });
    },
    function (session, results) {
        session.dialogData.weather.city = results[0];
        session.dialogData.weather.country = results[1];
        builder.Prompts.text(session, `Encontrei ${results[0]} ${results[1]}.\n É o que pretendes?`).then;
    },
    function (session, results) {
        if (results.response) {
            if (results.response.toUpperCase() === 'N' || results.response.toUpperCase() === 'NAO' || results.response.toUpperCase() === 'NÃO') { return session.endDialog('Tenta outra vez.'); }

            builder.Prompts.text(session, 'Em que dia?');
        }
    },
    function (session, results) {
        if (results.response) {
            const day = results.response;
            if (day.toUpperCase() === 'HOJE') {
                session.dialogData.weather.day = 0;
            } else
                if (day.toUpperCase() === 'AMANHÃ' || day.toUpperCase() === 'AMANHA') {
                    session.dialogData.weather.day = 1;
                } else {
                    return session.endDialog('Não consigo prever com esses parâmetros. Tenta outra vez.');
                }

            meteo.getWeatherByCityOnDay(session.dialogData.weather.city, session.dialogData.weather.country, session.dialogData.weather.day, (resp) => {
                if (resp.morning.description === undefined &&
                    resp.afternoon.description === undefined &&
                    resp.evening.description === undefined) {
                    return session.endDialog('Não existem dados disponíveis para esse dia.');
                }

                const thumbnails = [];

                if (resp.morning.description !== undefined) {
                    var card = new builder.ThumbnailCard(session)
                        .title(`${resp.city}`)
                        .subtitle(`Manhã: ${resp.morning.description}`)
                        .text(
                        `Temperatura: ${resp.morning.temperature.toFixed(2)} ℃` + ' \r\n' +
                        `Temp Máx: ${resp.morning.temperature_max.toFixed(2)} ℃` + ' \r\n' +
                        `\nTemp Min: ${resp.morning.temperature_min.toFixed(2)} ℃` + ' \r\n' +
                        `\nHumidade: ${resp.morning.humidity}`
                    )
                        .images([
                            builder.CardImage.create(session, `https://openweathermap.org/img/w/${resp.morning.icon}.png`),
                        ]);
                    thumbnails.push(card);
                }

                if (resp.afternoon.description != undefined) {
                    var card = new builder.ThumbnailCard(session)
                        .title(`${resp.city}`)
                        .subtitle(`Tarde: ${resp.afternoon.description}`)
                        .text(
                        `Temperatura: ${resp.afternoon.temperature.toFixed(2)} ℃` + ' \r\n' +
                        `Temp Máx: ${resp.afternoon.temperature_max.toFixed(2)} ℃` + ' \r\n' +
                        `\nTemp Min: ${resp.afternoon.temperature_min.toFixed(2)} ℃` + ' \r\n' +
                        `\nHumidade: ${resp.afternoon.humidity}`
                    )
                        .images([
                            builder.CardImage.create(session, `https://openweathermap.org/img/w/${resp.afternoon.icon}.png`),
                        ]);
                    thumbnails.push(card);
                }

                if (resp.evening.description != undefined) {
                    var card = new builder.ThumbnailCard(session)
                        .title(`${resp.city}`)
                        .subtitle(`Noite: ${resp.evening.description}`)
                        .text(
                        `Temperatura: ${resp.evening.temperature.toFixed(2)} ℃` + ' \r\n' +
                        `Temp Máx: ${resp.evening.temperature_max.toFixed(2)} ℃` + ' \r\n' +
                        `\nTemp Min: ${resp.evening.temperature_min.toFixed(2)} ℃` + ' \r\n' +
                        `\nHumidade: ${resp.evening.humidity}`
                    )
                        .images([
                            builder.CardImage.create(session, `https://openweathermap.org/img/w/${resp.evening.icon}.png`),
                        ]);
                    thumbnails.push(card);
                }


                const msg = new builder.Message(session)
                    .textFormat(builder.TextFormat.xml)
                    .attachments(thumbnails);
                session.send(msg);
                session.replaceDialog('start:startMessage', { reprompt: true });
            });
        }
    },
]);


/*
 * In order for the API to return in pt-PT, it's necessary to modify the 'bing' NPM module.
 * At the end of the URL concatenation functions in the module, concatenate '&culture=pt-PT'.
 * This will allow the the API to return in pt-PT.
 *
 */
lib.dialog('directions', [
    function (session, args) {
        session.dialogData.directions = args || {};
        builder.Prompts.text(session, 'Qual é o ponto de partida da tua viagem?');
    },
    function (session, results) {
        if (results.response) {
            session.dialogData.directions.start_point = results.response;
        }
        builder.Prompts.text(session, 'Qual é o ponto de destino da sua viagem?');
    },
    function (session, results) {
        if (results.response) {
            session.dialogData.directions.end_point = results.response;
        }
        const URL = `http://dev.virtualearth.net/REST/v1/Imagery/Map/Road/Routes?wp.0=${session.dialogData.directions.start_point}&wp.1=${session.dialogData.directions.end_point}&key=${process.env.BING_MAPS_API_KEY}`;
        session.send(`Aqui está a rota que encontrei entre ${session.dialogData.directions.start_point} e ${session.dialogData.directions.end_point}`);
        const message = new builder.Message(session)
            .addAttachment({
                contentUrl: URL,
                contentType: 'image/jpg',
                name: 'rota',
            });
        session.send(message);
        builder.Prompts.choice(session, 'Quer as direções para esta rota?', ['Sim', 'Não'], { listStyle: builder.ListStyle.button });
    },
    function (session, results) {
        if (results.response.entity === 'Sim') { builder.Prompts.choice(session, 'Qual é o modo de transporte a utilizar na viagem?', ['Caminhar', 'Carro'], { listStyle: builder.ListStyle.button }); } else { session.endDialogWithResult(results); }
    },
    function (session, results) {
        if (results.response.entity === 'Caminhar') {
            bing.maps.getWalkingRoute(session.dialogData.directions.start_point,
                session.dialogData.directions.end_point, (err, resp) => {
                    if (err) {
                        return session.endDialogWithResult('Oops, não consigo encontrar o meu mapa. Importas-te de tentar outra vez?');
                    } else if (resp.resourceSets === undefined) {
                        session.send('Não consigo encontrar direcções para essa viagem... Tens a certeza que esses locais existem? Tenta outra vez!');
                        session.replaceDialog('start:startMessage', { reprompt: true });
                    } else if (resp.resourceSets[0].resources[0].travelDistance >= 15) {
                        session.send('Não consigo encontrar direcções a caminhar para essa viagem... Talvez estejas a planear caminhar a mais? Tenta por carro!');
                        session.replaceDialog('start:startMessage', { reprompt: true });
                    } else {
                        const route = resp.resourceSets[0].resources[0].routeLegs[0].itineraryItems;

                        for (let i = 0, length = route.length; i < length; i += 1) {
                            const direction = (route[i].instruction.text);
                            session.send(direction);
                        }
                        session.send(results);
                        session.replaceDialog('start:startMessage', { reprompt: true });
                    }
                });
        }
        if (results.response.entity === 'Carro') {
            bing.maps.getDrivingRoute(session.dialogData.directions.start_point,
                session.dialogData.directions.end_point, (err, resp) => {
                    if (err) {
                        return session.endDialogWithResult('Oops, não consigo encontrar o meu mapa. Importas-te de tentar outra vez?');
                    } else if (resp.resourceSets === undefined) {
                        session.send('Não consigo encontrar direcções para essa viagem... Tens a certeza que esses locais existem? Tenta outra vez!');
                        session.replaceDialog('start:startMessage', { reprompt: true });
                    } else {
                        const route = resp.resourceSets[0].resources[0].routeLegs[0].itineraryItems;

                        for (let i = 0, length = route.length; i < length; i += 1) {
                            const direction = (route[i].instruction.text);
                            session.send(direction);
                        }
                        session.replaceDialog('start:startMessage', { reprompt: true });
                    }
                });
        }
    }]);


//= ========================================================
// Utilities
//= ========================================================

/**
 * Download file from url
 * @param {*} uri
 * @param {*} filename
 * @param {*} callback
 */
let download = function (uri, filename, callback) {
    request.head(uri, (err, res, body) => {
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
