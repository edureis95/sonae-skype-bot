var builder = require('botbuilder');
const sharepoint = require("../services/sharepoint/sharepoint");

module.exports = [
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
                    name: 'Clica aqui para veres o manual de primeiros passos na Sonae.'
                });

            session.endDialog(msg);
        });
    }
];
