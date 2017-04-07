var builder = require('botbuilder');
var fs = require('fs');
var request = require('request');

const vision = require('@google-cloud/vision') ({
    keyFilename: 'googleAPIKey/key.json',
    projectId: 'persuasive-yeti-163120'
});

var lib = new builder.Library('global_purpose');

lib.dialog('analyze_image', function (session) {
    
    var attachment = session.message.attachments[0];

    var date = new Date();
    var t = date.getTime();

    const fileName = 'uploads/temp' + t + '.' + attachment.contentType.substring(6);

    //Save temp image file
    download(attachment.contentUrl, fileName, function() {
        checkImage(fileName, function(caption) {
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

/**
 * Use vision API to get caption from image file
 * @param {*} fileName 
 * @param {*} callback 
 */
function checkImage(fileName, callback) {
    vision.detectSimilar(fileName)
    .then((data) => {
        const results = data[1].responses[0].webDetection;

        if (results.webEntities.length > 0) {
            callback(results.webEntities[0].description);
        }
        else
            callback('Couldn\'t find anything');
    });
}

// Export createLibrary() function
module.exports.createLibrary = function () {
    return lib.clone();
};

module.exports = { checkImage };