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

bot.dialog('/', function(session) {
    return session.beginDialog('faqs:sonae-faqs'); // FIXME: used directly for testing purposes. May change as necessary.
});

// import faqs dialogs
bot.library(require('./dialogs/faqsDialog').createLibrary());

module.exports = {
    listen: listen
};

