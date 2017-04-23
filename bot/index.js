const builder = require('botbuilder');

const connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD,
});

const bot = new builder.UniversalBot(connector);

const connectorListener = connector.listen();
function listen() {
    return function (req, res) {
        connectorListener(req, res);
    };
}

bot.dialog('/', [
    function(session) {
        session.beginDialog('start:startMessage');
    }
]);

// Enable Conversation Data persistence
// bot.set('persistConversationData', true);


//Start Dialog
bot.library(require('./dialogs/startMessage.js').createLibrary());

// Sub-Dialogs
bot.library(require('./dialogs/globalPurpose').createLibrary());
bot.library(require('./dialogs/other').createLibrary());
bot.library(require('./dialogs/productivity').createLibrary());
bot.library(require('./dialogs/attachmentExample').createLibrary());
bot.library(require('./dialogs/faqsDialog').createLibrary());

module.exports = {
    listen: listen/*,
    beginDialog: beginDialog,
    sendMessage: sendMessage*/
};
