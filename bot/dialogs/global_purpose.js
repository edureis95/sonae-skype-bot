var builder = require('botbuilder');
var meteo = require('../services/meteo')
var lib = new builder.Library('global_purpose');



lib.dialog('meteo/setLocation', [
    function (session) {
       builder.Prompts.text(session, "Qual a cidade que pretendes consultar?");
    },
    function (session, results) {
        if(results.response){
                session.dialogData.city = results.response;
                meteo.getWeatherByCityOnDay(results.response, '', 0, function(resp){
                    session.dialogData.country = resp.split(/Retrieved: /)[1];
                    location = [ session.dialogData.city, session.dialogData.country]
                    session.endDialogWithResult(location);
                });
        }

    }
]);


lib.dialog('meteo', [
    function (session, args, next) {
        session.dialogData.weather = args || {};
        if(!session.dialogData.weather.coutry)
            session.beginDialog('meteo/setLocation');
        else{
            next({ response: location });
        }
    },
    function (session, results) {
        session.dialogData.weather.city = results[0];
        session.dialogData.weather.country = results[1];
        builder.Prompts.text(session, 'Encontrei ' + results[0] + ' ' + results[1] + '.\n É o que pretendes?').then;
    },
    function(session, results){
    
        if(results.response) {
            if(results.response.toUpperCase() == 'N' || results.response.toUpperCase() == 'NAO'|| results.response.toUpperCase() == 'NÃO')
                return session.endDialog("Tenta outra vez."); 
            
            builder.Prompts.text(session, "Em que dia?");
        }
    },
    function (session, results) {
       
       if(results.response) {
           
           var day = results.response;
           if(day.toUpperCase() == 'HOJE')
                session.dialogData.weather.day = 0;
            else if(day.toUpperCase() == 'AMANHÃ' || day.toUpperCase() == 'AMANHA')
                session.dialogData.weather.day = 1;
            else
                return session.endDialog("Não consigo prever com esses parâmetros. Tenta outra vez."); 
        
        meteo.getWeatherByCityOnDay(session.dialogData.weather.city, session.dialogData.weather.country, session.dialogData.weather.day, function(resp){

        if(!resp.morning && !resp.afternoon  && !resp.evening)
            return session.endDialog("Não existem dados disponíveis para esse dia.");
            
            var thumbnails = [];
            
            if(resp.morning != undefined){
                    var card = new builder.ThumbnailCard(session)
                        .title(resp.city+'')
                        .subtitle('Manhã: ' + resp.morning.description)
                        .text(
                            'Temperatura: '+resp.morning.temperature.toFixed(2) +' ℃' +  ' \r\n' +
                            'Temp Máx: '+resp.morning.temperature_max.toFixed(2) +' ℃' +  ' \r\n' +
                            '\nTemp Min: '+ resp.morning.temperature_min.toFixed(2) +' ℃' + ' \r\n' +
                            '\nHumidade: '+ resp.morning.humidity
                        )
                        .images([
                            builder.CardImage.create(session, 'https://openweathermap.org/img/w/'+resp.morning.icon+'.png')
                        ]);
                    thumbnails.push(card);

                }

                if(resp.afternoon != undefined){
                    var card = new builder.ThumbnailCard(session)
                        .title(resp.city+'')
                        .subtitle('Tarde: ' + resp.afternoon.description)
                        .text(
                            'Temperatura: '+resp.afternoon.temperature.toFixed(2) +' ℃'+ ' \r\n' +
                            'Temp Máx: '+resp.afternoon.temperature_max.toFixed(2) +' ℃'+' \r\n' +
                            '\nTemp Min: '+ resp.afternoon.temperature_min.toFixed(2) +' ℃' +' \r\n' +
                            '\nHumidade: '+ resp.afternoon.humidity
                        )
                        .images([
                            builder.CardImage.create(session, 'https://openweathermap.org/img/w/'+resp.afternoon.icon+'.png')
                        ]);
                    thumbnails.push(card);

                }

                if(resp.evening != undefined){
                    var card = new builder.ThumbnailCard(session)
                        .title(resp.city+'')
                        .subtitle('Noite: ' + resp.evening.description)
                        .text(
                            'Temperatura: '+resp.evening.temperature.toFixed(2) +' ℃'+' \r\n' +
                            'Temp Máx: '+resp.evening.temperature_max.toFixed(2) +' ℃'+' \r\n' +
                            '\nTemp Min: '+ resp.evening.temperature_min.toFixed(2) +' ℃' +' \r\n' +
                            '\nHumidade: '+ resp.evening.humidity
                        )
                        .images([
                            builder.CardImage.create(session, 'https://openweathermap.org/img/w/'+resp.evening.icon+'.png')
                        ]);
                    thumbnails.push(card);
                }
                

            var msg = new builder.Message(session)
                    .textFormat(builder.TextFormat.xml)
                    .attachments(thumbnails);
                session.endDialog(msg); 
        });}
    }
]);

module.exports.createLibrary = function () {
    return lib.clone();
};