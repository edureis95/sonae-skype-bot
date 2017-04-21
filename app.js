// This loads the environment variables from the .env file
require('dotenv-extended').load();

const express = require('express');

// Web app
const app = express();

// Register your web app routes here
/* app.get('/', function (req, res, next) {
  res.render('index', { title: 'Sonae Bot' });
}); */

// Register Bot
const bot = require('./bot');

app.post('/api/messages', bot.listen());

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// Error handlers

// command line
// NODE_ENV=[development | production | testing] node app.js

// Development mode error handler, will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
}

// Production mode error handler, no stacktraces leaked to user
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
  });
});


// Start listening

const port = process.env.port || process.env.PORT || 3978;
app.listen(port, () => {
  console.log('Web Server listening on port %s', port);
});