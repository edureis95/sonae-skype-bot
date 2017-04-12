var builder = require('botbuilder');

var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID_,
    appPassword: process.env.MICROSOFT_APP_PASSWORD_
});

var bot = new builder.UniversalBot(connector);

// LUIS recognizer
var model = `https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/${process.env.LUIS_MODEL_APPID}?subscription-key=${process.env.LUIS_MODEL_SUBKEY}&timezoneOffset=0.0&verbose=true&q=`;
var recognizer = new builder.LuisRecognizer(model);
bot.recognizer(recognizer);

var connectorListener = connector.listen();
function listen() {
    return function (req, res) {       
        connectorListener(req, res);
    };
}

bot.dialog('/', (session) => {
  session.send('Hello World');
});

// Sub-Dialogs
bot.library(require('./dialogs/globalPurpose').createLibrary());

module.exports = {
    listen: listen,
};