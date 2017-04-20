var builder = require('botbuilder');


var lib = new builder.Library('productivity');

// Export createLibrary() function
module.exports.createLibrary = function () {
    return lib.clone();
};

module.exports = [
    function(session) {
        builder.Prompts.choice(
                session,
                'O que é que precisas?',
                ['Saber o manual de primeiros passos da Sonae'],
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
            case 'Saber o manual de primeiros passos da Sonae':
                return session.beginDialog('firstStepsManual');
        }
    }
];

