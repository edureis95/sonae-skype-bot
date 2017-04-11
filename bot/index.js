var builder = require('botbuilder');

var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

var bot = new builder.UniversalBot(connector);

// LUIS recognizer

var model = process.env.LUIS_MODEL_URL;
var recognizer = new builder.LuisRecognizer(model);
bot.recognizer(recognizer);

var connectorListener = connector.listen();
function listen() {
    return function (req, res) {       
        connectorListener(req, res);
    };
}

// Enable Conversation Data persistence
//bot.set('persistConversationData', true);

// Sub-Dialogs
bot.library(require('./dialogs/global_purpose').createLibrary());
/*
bot.library(require('./dialogs/...').createLibrary());
bot.library(require('./dialogs/...').createLibrary());    
*/

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