var builder = require('botbuilder');
var bing = require('bing');
var lib = new builder.Library('global_purpose');

process.env['BING_MAPS_API_KEY'] = 'AqNgdqQRbHbTI1C4i8R1drdqiKJ5u9bDgeJr1HxvdghjFewRCPln1YUzORPEYdf-';

lib.dialog('directions', [
    function (session, args) {
        session.dialogData.directions = args || {};
        builder.Prompts.text(session, "Qual é o ponto de partida da tua viagem?");
    },
    function (session, results) {
        if(results.response) {
            session.dialogData.directions.start_point = results.response;
        }
        builder.Prompts.text(session, "Qual é o ponto de destino da sua viagem?");
    },
    function(session, results) {
        if(results.response) {
            session.dialogData.directions.end_point = results.response;
        }
        builder.Prompts.text(session, "Qual é o modo de transporte a utilizar na viagem?");
    },
    function(session, results) {
        //TODO: API returns results in ENG (must be PT). Limit the distance when transportation mode is walking.

        if(results.response == 'caminhar')
        {
            bing.maps.getWalkingRoute(session.dialogData.directions.start_point, session.dialogData.directions.end_point, function(err, resp) {
                if(err) {
                    return session.endDialogWithResult("Oops, não consigo encontrar o meu mapa. Importas-te de tentar outra vez?");
                }
                else {
                    var route = resp.resourceSets[0].resources[0].routeLegs[0].itineraryItems;
                    var directions = '';

                    for(var i = 0, length = route.length; i < length; i++) {
                        var direction = (route[i].instruction.text);
                        session.send(direction);                        
                    }
                    
                    session.endDialogWithResult(results);
                }
            });        
        }
        if(results.response == 'carro')
        {
            bing.maps.getDrivingRoute(session.dialogData.directions.start_point, session.dialogData.directions.end_point, function(err, resp) {
                if(err) {
                    return session.endDialogWithResult("Oops, não consigo encontrar o meu mapa. Importas-te de tentar outra vez?");
                }
                else {
                    var route = resp.resourceSets[0].resources[0].routeLegs[0].itineraryItems;
                    var directions = '';

                    for(var i = 0, length = route.length; i < length; i++) {
                        var direction = (route[i].instruction.text);
                        session.send(direction);                        
                    }
                    
                    session.endDialogWithResult(results);
                }
            });        
        }
    }
    ]);


module.exports.createLibrary = function () {
    return lib.clone();
};