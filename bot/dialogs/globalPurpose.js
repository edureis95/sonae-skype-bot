/*
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
        builder.Prompts.choice(session, "Qual é o modo de transporte a utilizar na viagem?", ["Caminhar", "Carro"], {listStyle: builder.ListStyle.button});
    },
    function(session, results) {
        if(results.response.entity == 'Caminhar')
        {
            bing.maps.getWalkingRoute(session.dialogData.directions.start_point, session.dialogData.directions.end_point, function(err, resp) {
                if(err) {
                    return session.endDialogWithResult("Oops, não consigo encontrar o meu mapa. Importas-te de tentar outra vez?");
                }
                else {
                    if (resp.resourceSets == undefined) {
                        session.send("Não consigo encontrar direcções para essa viagem... Tens a certeza que esses locais existem? Tenta outra vez!");
                        session.endDialogWithResult(results);
                    }
                    else {
                        if (resp.resourceSets[0].resources[0].travelDistance >= 15) {
                        session.send("Não consigo encontrar direcções a caminhar para essa viagem... Talvez estejas a planear caminhar a mais? Tenta por carro!");
                        session.endDialogWithResult(results);
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
                }
            }
        }); 
    }
        if(results.response.entity == 'Carro')
        {
            bing.maps.getDrivingRoute(session.dialogData.directions.start_point, session.dialogData.directions.end_point, function(err, resp) {
                if(err) {
                    return session.endDialogWithResult("Oops, não consigo encontrar o meu mapa. Importas-te de tentar outra vez?");
                }
                else {
                    if (resp.resourceSets == undefined) {
                        session.send("Não consigo encontrar direcções para essa viagem... Tens a certeza que esses locais existem? Tenta outra vez!");
                        session.endDialogWithResult(results);
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
                }
            });        
        }
    }
    ]);

module.exports.createLibrary = function () {
    return lib.clone();
};