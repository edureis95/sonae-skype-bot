var builder = require('botbuilder');

module.exports = [
    function(session) {
        builder.Prompts.choice(
                session,
                'O que deseja saber?',
                ['Ementa'],
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
            case 'Ementa':
                return session.beginDialog('foodMenu');
        }
    }
];
