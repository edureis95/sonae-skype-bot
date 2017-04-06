var builder = require('botbuilder');

var lib = new builder.Library('productivity');

// Export createLibrary() function
module.exports.createLibrary = function () {
    return lib.clone();
};