const builder = require('botbuilder');
const sharepoint = require("../services/sharepoint/sharepoint");

const lib = new builder.Library('attachment_example');

lib.dialog('attachment', [
    function (session) {

        let filename = "'Quadro 1ª Conciliação.xls'";
        sharepoint.getFileUrlFromSharePoint(filename, function (url) {
            if (url === null)
                return session.endDialog("Error retrieving file's URL.");

            /* TODO alterar isto */
            let contentType = 'application/excel';

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