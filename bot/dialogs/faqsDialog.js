
/**
 * This file contains all the dialogs
 * related to FAQs
 */

const builder = require('botbuilder');
const cognitiveServices = require('botbuilder-cognitiveservices');

const lib = new builder.Library('faqs');

// General bot responses
const negativeResponse = 'Lamento, mas não sei nada sobre isso. Pergunta-me outras coisas.';

// SONAE FAQs dialog
const recognizer = new cognitiveServices.QnAMakerRecognizer({
  knowledgeBaseId: process.env.SONAE_FAQS_KBID,
  subscriptionKey: process.env.SONAE_FAQS_SUBKEY,
});

lib.dialog('sonae-faqs', [
  function (session) {
    builder.Prompts.text(session, 'O que queres saber da SONAE?');
  },
  function (session, results) {
    session.beginDialog('query-faqs');
  }
]);

lib.dialog('query-faqs', new cognitiveServices.QnAMakerDialog({
  recognizers: [recognizer],
  defaultMessage: negativeResponse,
  qnaThreshold: 0.5,
}));

// Export the dialogs
module.exports.createLibrary = function () {
  return lib.clone();
};
