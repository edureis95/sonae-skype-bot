var builder = require('botbuilder');

var lib = new builder.Library('other');

var HelpMessage = '\n Posso ajudar-te nas seguintes áreas:\n * Reuniões\n * Produtividade\n * Suporte\n * Dicas e Atalhos\n * Propósitos Gerais';
var UserNameKey = 'UserName';
var UserWelcomedKey = 'UserWelcomed';

// Greet dialog
lib.dialog('greet', new builder.SimpleDialog(function (session, results) {
    if (results && results.response) {
        session.userData[UserNameKey] = results.response;
        session.privateConversationData[UserWelcomedKey] = true;

        return session.endDialog('Olá %s! %s', results.response, HelpMessage);
    }

    builder.Prompts.text(session, 'Olá, como te chamas?');
}));

// Help dialog
lib.dialog('help', function (session) {
    
    return session.endDialog(HelpMessage);

});


// Export createLibrary() function
module.exports.createLibrary = function () {
    return lib.clone();
};