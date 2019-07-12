var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var passport = require('passport');
var BearerStrategy = require('passport-azure-ad').BearerStrategy;
var fs = require('fs');

var authenticatedUserTokens = [];

var apiRouter = require('./routes/api');

var options = {
    identityMetadata: 'https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration',
    clientID: '2318f86a-f186-4e0f-bd11-c9d357787879',
    validateIssuer: false,
    passReqToCallback: false,
    loggingLevel:'info'
};

const authenticationStrategy = new BearerStrategy(options, (token, done) => {
    let currentUser = null;

    let userToken = authenticatedUserTokens.find((user) => {
        currentUser = user;
        user.sub === token.sub;
    });

    if(!userToken) {
        authenticatedUserTokens.push(token);
    }

    return done(null, currentUser, token);
});

passport.use(authenticationStrategy);


var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(passport.initialize());
app.use(passport.session());

app.get('/api/test', apiRouter);
app.get('/api/profiles', passport.authenticate('oauth-bearer', { session: false }), function(req, res, next) {
    console.log('Headers are: ' + JSON.stringify(req.headers));
    fs.readFile('../BackendNodejs/profiles.json', (err, jsonData) => {
      if (err) {
        console.log("Error reading file: ", err)
        return
      }
      
      jsonProfiles = JSON.parse(jsonData);
  
      res.send(jsonProfiles);
  
    })
  });

module.exports = app;
