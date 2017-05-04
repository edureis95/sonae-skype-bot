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
    function(session, results) {
        session.beginDialog('start:startMessage');
    }
]);

bot.dialog('/exit', function (session, args) {
    session.send('Sempre ao dispor.');
    session.replaceDialog('start:startMessage', { reprompt: true });
});

//Start Dialog
bot.library(require('./dialogs/startMessage.js').createLibrary());

// Sub-Dialogs
bot.library(require('./dialogs/globalPurpose').createLibrary());
bot.library(require('./dialogs/other').createLibrary());
//bot.library(require('./dialogs/productivity').createLibrary());
bot.library(require('./dialogs/attachmentExample').createLibrary());
bot.library(require('./dialogs/faqsDialog').createLibrary());

//bot.endConversationAction('sair', 'Sempre ao dispor.', { matches: /^sair/i });
bot.beginDialogAction('restart', '/exit', { matches: /^sair/i });



// STUFF I ADDED
bot.dialog('/notify', function (session, args) {
    // Deliver notification to the user.
    session.endDialog(args.msgId, args.params);
});

module.exports = {
    listen: listen,
};
