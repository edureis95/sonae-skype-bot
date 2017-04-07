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

    download(attachment.contentUrl, 'uploads/temp.' + attachment.contentType.substring(6), function() {
        // The path to the local image file, e.g. "/path/to/image.png"
        const fileName = 'uploads/temp.' + attachment.contentType.substring(6);

        // Detect similar images on the web to a local file
        vision.detectSimilar(fileName)
        .then((data) => {
            const results = data[1].responses[0].webDetection;

            if (results.webEntities.length > 0) {
                session.endDialog(results.webEntities[0].description);
            }

            fs.unlink('uploads/temp.' + attachment.contentType.substring(6));
        });
    });
});

lib.dialog('food_menu', function(session) {
    return session.endDialog('[Insert Menu here]');
});

//=========================================================
// Utilities
//=========================================================

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