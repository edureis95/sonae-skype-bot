var builder = require('botbuilder');
var fs = require('fs');
var request = require('request');
var google_vision = require('../services/google_vision.js');

var lib = new builder.Library('global_purpose');

lib.dialog('analyze_image', function (session) {
    
    var attachment = session.message.attachments[0];

    var date = new Date();
    var t = date.getTime();

    const fileName = 'uploads/temp' + t + '.' + attachment.contentType.substring(6);

    //Save temp image file
    download(attachment.contentUrl, fileName, function() {
        google_vision.checkImage(fileName, function(caption) {
            session.endDialog(caption);
            //Delete temp image file
            fs.unlink(fileName);
        });
    });
});

lib.dialog('food_menu', function(session) {
    return session.endDialog('[Insert Menu here]');
});

//=========================================================
// Utilities
//=========================================================

/**
 * Download file from url
 * @param {*} uri 
 * @param {*} filename 
 * @param {*} callback 
 */
var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

// Export createLibrary() function
module.exports.createLibrary = function () {
    return lib.clone();
};