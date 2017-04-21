const vision = require('@google-cloud/vision') ({
    keyFilename: 'googleAPIKey/key.json',
    projectId: 'persuasive-yeti-163120'
});

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

module.exports = { checkImage };