
const sharepointRequest = require('sp-request');
const spAuth = require('node-sp-auth');
const request = require('request-promise');

/**
 * Retrieves file from SharePoint
 * @param {string} filename must be between '' ex: var filename = "'ficheiro.xls'"
 */
/* TODO CHANGE THIS TO SONAE BOT WEBSITE*/
function getFileFromSharePoint(filename) {

    const partialEndpoint = "https://sonaesystems.sharepoint.com/sites/EQUIPALPTNORTH/_api/Files("
    const url = partialEndpoint + filename + ')/$value';

    let creds = {
        username: process.env.SONAE_USERNAME,
        password: process.env.SONAE_PASSWORD
    }

    var spRequest = sharepointRequest.create(creds);

    spRequest.get(url)
        .then(function (response) {
            console.log("Successfully retrieved file");
        })
        .catch(function (err) {
            console.log('Error retrieving file from sharepoint. Check the filename');
        });
}

/**
 * Method that gets auth token for access sharepoint data
 */
/*
function getAuth() {
    spAuth
        .getAuth('https://sonaesystems.sharepoint.com/sites/dev/', {
            username: 'MBOTELHO@parceiro.sonae.pt',
            password: 'Feup2017'
        })
        .then(function (data) {
            var headers = data.headers;
            headers['Accept'] = 'application/json;odata=verbose';

            request.get({
                url: 'https://sonaesystems.sharepoint.com/sites/dev/_api/web',
                headers: headers,
                json: true
            }).then(function (response) {
                console.log(response.d.Title);
            });
        });
} */

module.exports = { getFileFromSharePoint };