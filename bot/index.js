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

bot.dialog('/', (session) => {
  if (session.message.text === 'direcções' || session.message.text === 'direccoes') { return session.beginDialog('global_purpose:directions'); }
  session.send('Hello World');
});

// Sub-Dialogs
bot.library(require('./dialogs/globalPurpose').createLibrary());

module.exports = {
  listen,
};
