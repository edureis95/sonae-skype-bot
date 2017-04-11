
const sharepointRequest = require('sp-request');
const spAuth = require('node-sp-auth');
const request = require('request-promise');

/**
 * Retrieves file from SharePoint
 * @param {string} filename must be between '' ex: var filename = "'ficheiro.xls'"
 */
/* TODO CHANGE THIS TO SONAE BOT WEBSITE*/
function getFileFromSharePoint(filename, callback) {

    const partialEndpoint = "https://sonaesystems.sharepoint.com/sites/EQUIPALPTNORTH/_api/Files("
    const url = partialEndpoint + filename + ')/$value';

    let creds = {
        username: process.env.SONAE_USERNAME,
        password: process.env.SONAE_PASSWORD
    }

    var spRequest = sharepointRequest.create(creds);

    spRequest.get(url)
        .then(function (response) {
            //console.log(response.body);
            callback(response.body);
        }).catch(function (err) {
            console.log('Error retrieving file from sharepoint. Check the filename');
            callback(err);
        });
}

/**
 * Retrieves file's url from SharePoint
 * @param {string} filename must be between '' ex: var filename = "'ficheiro.xls'"
 */
function getFileUrlFromSharePoint(filename, callback) {

    const partialEndpoint = "https://sonaesystems.sharepoint.com/sites/EQUIPALPTNORTH/_api/Files("
    const url = partialEndpoint + filename + ')';

    let creds = {
        username: process.env.SONAE_USERNAME,
        password: process.env.SONAE_PASSWORD
    }

    var spRequest = sharepointRequest.create(creds);

    spRequest.get({
        url: url,
        json: true
    }
    ).then(function (response) {
        console.log(response.body.d.Url);
        callback(response.body.d.Url);
    }).catch(function (err) {
        console.log('Error retrieving file from sharepoint. Check the filename');
        callback(err);
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

module.exports = { getFileFromSharePoint, getFileUrlFromSharePoint };