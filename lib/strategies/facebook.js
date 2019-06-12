const FacebookStrategy = require('passport-facebook').Strategy;
const config = require('config');
const authenticate = require('./authenticate');

module.exports = new FacebookStrategy({
    clientID: config.get('providers.facebook.appId'),
    clientSecret: config.get('providers.facebook.appSecret'),
    callbackURL: config.get('providers.facebook.callbackURI'),
    profileFields: ['displayName', 'email'],
    session: false,
  }, async function(accessToken, refreshToken, profile, done) {
    authenticate('github', profile.emails[0].value, profile, done);
  }
);
