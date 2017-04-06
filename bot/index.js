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

bot.dialog('/', function(session) {
    return session.beginDialog('faqs:sonae-faqs')
});

// import faqs dialogs
bot.library(require('./dialogs/faqs_dialog').createLibrary());

module.exports = {
    listen: listen
};