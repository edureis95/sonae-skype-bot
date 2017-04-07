/*var gcloud = require('gcloud')({
  keyFilename: 'googleAPIKey/key.json',
  projectId: 'persuasive-yeti-163120'
});*/



var builder = require('botbuilder');

var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

var bot = new builder.UniversalBot(connector);

var connectorListener = connector.listen();
function listen() {
    return function (req, res) {       
        connectorListener(req, res);
    };
}

var UserNameKey = 'UserName';
var UserWelcomedKey = 'UserWelcomed';


bot.dialog('/', function(session) {

    //Insert here all dialogs available
    
    var userName = session.userData[UserNameKey];
    
    if (!userName) {
        return session.beginDialog('other:greet');
    }
    
    else if(session.message.text.toUpperCase() == 'OLÁ'){
        return session.beginDialog('other:greet');
    }

   else if(session.message.text.toUpperCase() == 'AJUDA'){
        return session.beginDialog('other:help');
    }
    //Analyse Image Dialog
    else if (hasImageAttachment(session)) {
        return session.beginDialog('global_purpose:analyze_image');
    
    }
    else if(session.message.text.toUpperCase() == 'EMENTA') {
        return session.beginDialog('global_purpose:food_menu');
    }
    else{
        return session.send("Não percebi. Tenta escrever \'Ajuda\' para saberes como te posso ajudar.");
    }
	
      
})


// Enable Conversation Data persistence
//bot.set('persistConversationData', true);

// Sub-Dialogs

bot.library(require('./dialogs/global_purpose').createLibrary());
bot.library(require('./dialogs/other').createLibrary());
bot.library(require('./dialogs/productivity').createLibrary());
//bot.library(require('./dialogs/...').createLibrary());    


/*
function beginDialog(address, dialogId, dialogArgs) {
    bot.beginDialog(address, dialogId, dialogArgs);
}

function sendMessage(message) {
    bot.send(message);
}*/



module.exports = {
    listen: listen/*,
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



