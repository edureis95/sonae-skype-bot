
/**
 * This file contains all the dialogs 
 * related to FAQs
 */

var builder = require('botbuilder');
var cognitiveServices = require('botbuilder-cognitiveservices'); 
var lib = new builder.Library('faqs');

// General bot responses
var negativeResponse = 'Lamento, mas não sei nada sobre isso. Pergunta-me outras coisas.';

// SONAE FAQs dialog
var recognizer = new cognitiveServices.QnAMakerRecognizer({
    knowledgeBaseId: process.env.SONAE_FAQS_KBID,
    subscriptionKey: process.env.SONAE_FAQS_SUBKEY
});

lib.dialog('sonae-faqs', new cognitiveServices.QnAMakerDialog({
    recognizers: [recognizer],
    defaultMessage: negativeResponse,
    qnaThreshold: 0.3
}));

// Export the dialogs
module.exports.createLibrary = function() {
    return lib.clone();
};
