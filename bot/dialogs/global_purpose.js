var builder = require('botbuilder');
var captionService = require('../services/caption-service');
var needle = require('needle');

var lib = new builder.Library('global_purpose');



lib.dialog('analyze_image', function (session) {
     var stream = getImageStreamFromMessage(session.message);
        captionService
            .getCaptionFromStream(stream)
            .then(function (caption) { handleSuccessResponse(session, caption); })
            .catch(function (error) { handleErrorResponse(session, error); });
});

lib.dialog('food_menu', function(session) {
    return session.endDialog('[Insert Menu here]');
});

//=========================================================
// Utilities
//=========================================================

/**
 * Gets the image stream from the message
 * @param {*} message
 * @returns {stream} Image stream
 */
function getImageStreamFromMessage(message) {
    var headers = {};
    var attachment = message.attachments[0];
    if (checkRequiresToken(message)) {
        // The Skype attachment URLs are secured by JwtToken,
        // you should set the JwtToken of your bot as the authorization header for the GET request your bot initiates to fetch the image.
        // https://github.com/Microsoft/BotBuilder/issues/662
        connector.getAccessToken(function (error, token) {
            var tok = token;
            headers['Authorization'] = 'Bearer ' + token;
            headers['Content-Type'] = 'application/octet-stream';

            return needle.get(attachment.contentUrl, { headers: headers });
        });
    }

    headers['Content-Type'] = attachment.contentType;
    return needle.get(attachment.contentUrl, { headers: headers });
}

function checkRequiresToken(message) {
    return message.source === 'skype' || message.source === 'msteams';
}

/**
 * Gets the href value in an anchor element.
 * Skype transforms raw urls to html. Here we extract the href value from the url
 * @param {string} input Anchor Tag
 * @return {string} Url matched or null
 */
function parseAnchorTag(input) {
    var match = input.match('^<a href=\"([^\"]*)\">[^<]*</a>$');
    if (match && match[1]) {
        return match[1];
    }

    return null;
}

//=========================================================
// Response Handling
//=========================================================

/**
 * Handles a success response from the Vision API
 * @param {*} session 
 * @param {*} caption 
 */
function handleSuccessResponse(session, caption) {
    if (caption) {
        session.send('I think it\'s ' + caption);
        session.endDialog();
    }
    else {
        session.send('Couldn\'t find a caption for this one');
        session.endDialog();
    }

}

/**
 * Handles an error response from the Vision API
 * @param {*} session 
 * @param {*} error 
 */
function handleErrorResponse(session, error) {
    session.send('Oops! Something went wrong. Try again later.');
    console.error(error);
}


// Export createLibrary() function
module.exports.createLibrary = function () {
    return lib.clone();
};