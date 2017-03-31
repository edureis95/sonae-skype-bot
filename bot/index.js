var builder = require('botbuilder');
var cognitiveServices = require('botbuilder-cognitiveservices');

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


//____________________________________________________________

var recognizer = new cognitiveServices.QnAMakerRecognizer({
    knowledgeBaseId: process.env.SONAE_FAQS_KBID,
    subscriptionKey: process.env.SONAE_FAQS_SUBKEY
});

bot.dialog('/', new cognitiveServices.QnAMakerDialog({
    recognizers: [recognizer],
    defaultMessage: "I didn't what you say. Repeat please.",
    qnaThreshold: 0.3
}));

//____________________________________________________________

// Enable Conversation Data persistence
//bot.set('persistConversationData', true);

// Sub-Dialogs
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