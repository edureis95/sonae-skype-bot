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
    function (session) {
        session.preferredLocale('pt');
        builder.Prompts.choice(
            session,
            'O que pretendes fazer?',
            ['Obter suporte', 'Ajuda', 'Ementa', 'Análise Imagem', 'Tempo', 'Faqs', 'Direções'],
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
                return session.beginDialog('foodMenu');
                break;
            case 'Análise Imagem':
                return session.beginDialog('global_purpose:analyze_image');
                break;
            case 'Tempo':
                return session.beginDialog('global_purpose:meteo');
                break;
            case 'Faqs':
                session => session.beginDialog('faqs:sonae-faqs');  // FIXME: used directly for testing purposes. May change as necessary.
                break;
            case 'Direções':
                return session.beginDialog('global_purpose:directions');
            default:
                return session.send("Não percebi. Tenta escrever \'Ajuda\' para saberes como te posso ajudar.");
                break;
        }
    }
]);

// Enable Conversation Data persistence
// bot.set('persistConversationData', true);

// Sub-Dialogs
bot.library(require('./dialogs/globalPurpose').createLibrary());
bot.library(require('./dialogs/other').createLibrary());
bot.library(require('./dialogs/productivity').createLibrary());
//bot.library(require('./dialogs/...').createLibrary());    

bot.library(require('./dialogs/attachmentExample').createLibrary());
bot.dialog('firstStepsManual', require('./dialogs/firstStepsManual.js'));
bot.dialog('foodMenu', require('./dialogs/foodMenu.js'));
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

// import faqs dialogs
bot.library(require('./dialogs/faqsDialog').createLibrary());

module.exports = {
    listen: listen/*,
    beginDialog: beginDialog,
    sendMessage: sendMessage*/
};