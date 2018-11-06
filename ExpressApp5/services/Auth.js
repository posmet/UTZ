'use strict';

const config = require('nconf').get('session');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const compose = require('composable-middleware');
const messageManager = require('./Message');
const validateJwt = expressJwt({ secret: config.secret });

exports.isAuthenticated = () => {
  return compose()
  // Validate jwt
    .use(function(req, res, next) {
      // allow access_token to be passed through query parameter as well
      if(req.query && req.query.hasOwnProperty('access_token')) {
        req.headers.authorization = 'Bearer ' + req.query.access_token;
      }
      validateJwt(req, res, next);
    })
    // Attach user to request
    .use(function(req, res, next) {
      console.log(req.user);
      /*async.series([
        function(callback){
          User.findById(req.user._id, callback);
        },
        function(callback){
          Provider.findOne({account: req.user._id}, callback);
        },
        function(callback){
          Customer.findOne({account: req.user._id}, callback);
        },
        function(callback){
          Staff.findOne({account: req.user._id}, callback);
        }
      ], function(err, results){
        if (err) return next(err);
        if (!results[0]) return res.sendStatus(401);

        req.user = results[0].toJSON();
        if (results[1]) {
          req.user.providerId = results[1]._id;
          req.user.companyName = results[1].name;
        }
        if (results[2]) {
          req.user.customerId = results[2]._id;
        }
        if (results[3]) { //TODO: temp solution
          req.user.providerId = results[3].provider;
          req.user.staffId = results[3]._id;
        }
        if (logUserToSession){
          req.session.user = req.user;
        }
        next();
      });*/
    });
};

exports.signToken = (id) => {
  return jwt.sign({ userid: id }, config.secret, { expiresIn: config.expire}); //expiresIn in seconds, 30 days
};
