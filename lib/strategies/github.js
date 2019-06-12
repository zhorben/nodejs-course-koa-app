const GithubStrategy = require('passport-github').Strategy;
const config = require('config');
const authenticate = require('./authenticate');

module.exports = new GithubStrategy({
    clientID: config.get('providers.github.appId'),
    clientSecret: config.get('providers.github.appSecret'),
    callbackURL: config.get('providers.github.callbackURI'),
    scope: ['user:email'],
    session: false,
  }, function(accessToken, refreshToken, profile, done) {
    profile.displayName = profile.username;
    authenticate('github', profile.emails[0].value, profile, done);
  }
);
