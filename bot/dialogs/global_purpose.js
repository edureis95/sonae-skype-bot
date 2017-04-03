/*
 * In order to retrive from the Bing Maps API, it's necessary to get a key (through the Bing Maps Portal) and then set it as an environmental variable in the sonae-bot dir.
 * To do so, just open a command prompt in the dir and type: set BING_MAPS_API_KEY=<Your API key>.
 * 
 * In order for the API to return in pt-PT, it's necessary to modify the 'bing' NPM module. At the end of the URL concatenation functions in the module, concatenate '&culture=pt-PT'.
 * This will allow the the API to return in pt-PT.
 * 
 */

var builder = require('botbuilder');
var bing = require('bing');
var lib = new builder.Library('global_purpose');

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
        //TODO: Limit the distance when transportation mode is walking.

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