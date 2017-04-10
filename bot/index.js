const builder = require('botbuilder');

const SP = require('./services/sharepoint/sharepoint');

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
  SP.getFileFromSharePoint("'Quadro 1ª Conciliação.xls'");
  session.send('Hello World');
});


// Enable Conversation Data persistence
// bot.set('persistConversationData', true);

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
  listen, /* ,
    beginDialog: beginDialog,
    sendMessage: sendMessage*/
};
