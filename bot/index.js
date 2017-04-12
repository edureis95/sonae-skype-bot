var builder = require('botbuilder');

var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID_,
    appPassword: process.env.MICROSOFT_APP_PASSWORD_
});

var bot = new builder.UniversalBot(connector);

var connectorListener = connector.listen();
function listen() {
    return function (req, res) {       
        connectorListener(req, res);
    };
}

bot.dialog('/', function (session) {		
    if(session.message.text == "direcções" || session.message.text == "direccoes")		
         return session.beginDialog('global_purpose:directions');		
    else		
         session.send("Hello World");		
 });

// Sub-Dialogs
bot.library(require('./dialogs/globalPurpose').createLibrary());

module.exports = {
    listen: listen,
};