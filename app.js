// This loads the environment variables from the .env file
require('dotenv-extended').load();

var express = require('express');

// Web app
var app = express();

// Register your web app routes here
/*app.get('/', function (req, res, next) {
  res.render('index', { title: 'Sonae Bot' });
}); */

// Register Bot
var bot = require('./bot');
app.post('/api/messages', bot.listen());

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// Error handlers

//command line
//NODE_ENV=[development | production | testing] node app.js

// Development mode error handler, will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// Production mode error handler, no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


// Start listening
var port = process.env.port || process.env.PORT || 3978;
app.listen(port, function () {
  console.log('Web Server listening on port %s', port);
});