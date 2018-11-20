
/**
 * Module dependencies
 */

const express = require('express');
const app = module.exports = express();
const nconf = require("nconf");
const http = require("http");
const messageManager = require('./services/Message');
require('./config');
require('./boot')(app);
require('./routes')(app);

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    return messageManager.sendMessage(res, "Неверный токен авторизации", 401);
  }
  const contentType = req.headers['content-type'];
  if (req.xhr || (!contentType || contentType && contentType.indexOf('json') > -1)) {
    messageManager.sendMessage(res, err);
  } else {
    next(err);
  }
});

/**
 * Configuration
 */

const env = nconf.get('NODE_ENV') || 'development';

// production only
if (env === 'production') {
  // TODO
}

/**
 * Start Server
 */

http.createServer(app).listen(app.get('port'), function () {
    if ('development' === app.get('env')) {
        console.log('Express server listening on port ' + app.get('port'));
    }
});