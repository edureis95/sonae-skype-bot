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
      builder.Prompts.choice(
              session,
              'O que pretendes fazer?',
              ['Obter suporte', 'Ajuda', 'Ementa', 'Análise Imagem'],
              {
                  maxRetries: 3,
                  retryPrompt: 'Not a valid option',
                  listStyle: 3
              }
      );
  },
  function (session, result) {
    if (!result.response) {
            // exhausted attemps and no selection, start over
            session.send('Ooops! Too many attemps :( But don\'t worry, I\'m handling that exception and you can try again!');
            return session.endDialog();
    }

    // on error, start over
    session.on('error', function (err) {
        session.send('Failed with message: %s', err.message);
        session.endDialog();
    });
    
    // continue on proper dialog
    var selection = result.response.entity;
    switch (selection) {
        case 'Obter suporte':
            return session.beginDialog('productivity');
            break;
      case 'Ajuda':
            return session.beginDialog('other:help');
            break;
      case 'Ementa': 
            return session.beginDialog('global_purpose:food_menu');
            break;
      case 'Análise Imagem':
            return session.beginDialog('global_purpose:analyze_image'); 
            break;
      default:
            return session.send("Não percebi. Tenta escrever \'Ajuda\' para saberes como te posso ajudar.");
            break;    
    }
  } 
]);

// Enable Conversation Data persistence
// bot.set('persistConversationData', true);

// Sub-Dialogs
bot.library(require('./dialogs/global_purpose').createLibrary());
bot.library(require('./dialogs/other').createLibrary());
bot.library(require('./dialogs/productivity').createLibrary());
//bot.library(require('./dialogs/...').createLibrary());    

bot.library(require('./dialogs/attachment_example').createLibrary());
bot.dialog('firstStepsManual', require('./dialogs/firstStepsManual.js'));
bot.dialog('productivity', require('./dialogs/productivity.js'));

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

//=========================================================
// Utilities
//=========================================================
function hasImageAttachment(session) {
    return session.message.attachments.length > 0 &&
        session.message.attachments[0].contentType.indexOf('image') !== -1;
}