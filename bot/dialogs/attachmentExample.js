"use strict";
//modules
const builder = require('botbuilder');
const sharepoint = require("../services/sharepoint/sharepoint");

//lib
const lib = new builder.Library('attachment_example');


//Dialog example
lib.dialog('attachment', [
    function (session) {

        //todo alterar para o nome do ficheiro pretendido conforme
        let filename = "'exemplo.pdf'";

        sharepoint.getFileUrlFromSharePoint(filename, function (url) {

            if (url === null)
                return session.endDialog("Error retrieving file's URL.");

            let contentType = 'application/pdf';

            var msg = new builder.Message(session)
                .addAttachment({
                    contentUrl: url,
                    contentType: contentType,
                    name: filename
                });

            session.endDialog(msg);
        });
    }
]);

module.exports.createLibrary = function () {
    return lib.clone();
};