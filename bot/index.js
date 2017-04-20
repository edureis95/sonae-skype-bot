var builder = require('botbuilder');

var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

var bot = new builder.UniversalBot(connector);

var connectorListener = connector.listen();
function listen() {
    return function (req, res) {       
        connectorListener(req, res);
    };
}

bot.dialog('/', function (session) {
    session.userData.email = process.env.EMAIL;
     if(session.message.text == "meteorologia" || session.message.text == "tempo")
        return session.beginDialog('global_purpose:meteo');;
});


// Enable Conversation Data persistence
//bot.set('persistConversationData', true);

// Sub-Dialogs

bot.library(require('./dialogs/global_purpose').createLibrary());



/*
function beginDialog(address, dialogId, dialogArgs) {
    bot.beginDialog(address, dialogId, dialogArgs);
}

function sendMessage(message) {
    bot.send(message);
}*/



module.exports = {
    listen: listen/*,
    beginDialog: beginDialog,
    sendMessage: sendMessage*/
};