const builder = require('botbuilder');

const lib = new builder.Library('start');

lib.dialog('startMessage', [
    function (session, args) {
        session.preferredLocale('pt');
        if (args && args.reprompt) {
            builder.Prompts.choice(
                session,
                'Queres fazer mais alguma coisa?',
                ['Obter Informações'],
                {
                    maxRetries: 0,
                    retryPrompt: 'Não é uma opção válida. Tenta outra vez.',
                    listStyle: 3
                }
            );
        } else {
            builder.Prompts.choice(
                session,
                'O que pretendes fazer?',
                ['Obter Informações'],
                {
                    maxRetries: 0,
                    retryPrompt: 'Não é uma opção válida. Tenta outra vez.',
                    listStyle: 3
                }
            );
        }
    },
    function (session, result) {
        if (!result.response) {
            // exhausted attemps and no selection, start over
            switch (session.message.text.toLowerCase()) {
                case 'ajuda':
                    return session.beginDialog('other:help');
                case 'manual primeiros passos':
                    return session.beginDialog('global_purpose:firstStepsManual');
                case 'ementa':
                    return session.beginDialog('global_purpose:foodMenu');
                case 'análise imagem':
                    return session.beginDialog('global_purpose:analyze_image');
                case 'tempo':
                    return session.beginDialog('global_purpose:meteo');
                case 'faqs':
                    return session.beginDialog('faqs:sonae-faqs');
                case 'direções':
                    return session.beginDialog('global_purpose:directions');
                default:
                    return session.send('Não percebi. Tenta escrever \'Ajuda\' para saberes como te posso ajudar.');
            }
            return session.endDialog();
        }

        // on error, start over
        session.on('error', function (err) {
            session.send('Failed with message: %s', err.message);
            session.endDialog();
        });

        // continue on proper dialog
        const selection = result.response.entity;
        switch (selection) {
            case 'Obter Informações':
                return session.beginDialog('global_purpose:options');
            default:
                break;
        }
    }
]);


// Export createLibrary() function
module.exports.createLibrary = function () {
    return lib.clone();
};