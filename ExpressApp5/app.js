
/**
 * Module dependencies
 */

var express = require('express'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  errorHandler = require('error-handler'),
  morgan = require('morgan'),
  api = require('./routes/api'),
  http = require('http'),
  path = require('path');
  config = require("nconf");
  passport = require('passport');
  flash = require('connect-flash');

var app = module.exports = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
require('./boot/index')(app);
require('./routes/index')(app);

/**
 * Configuration
 */

// all environments



var env = process.env.NODE_ENV || 'development';

// development only
if (env === 'development') {
  app.use(express.errorHandler());
}

// production only
if (env === 'production') {
  // TODO
}


/**
 * Routes
 */

// serve index and view partials
//app.get('/', routes.index);
//app.get('/partials/:name', routes.partials);

// JSON API
//app.get('/api/name', api.name);
//app.get('/api/Result', api.Result);  // data get in json formate from mssql database
// redirect all others to the index (HTML5 history)
//app.get('*', routes.index);

/**
 * Start Server
 */

http.createServer(app).listen(app.get('port'), function () {
    if ('development' == app.get('env')) {
        console.log('Express server listening on port ' + app.get('port'));
    }
});