const VkontakteStrategy = require('passport-vkontakte').Strategy;
const config = require('config');
const authenticate = require('./authenticate');

module.exports = new VkontakteStrategy({
    clientID: config.get('providers.vkontakte.appId'),
    clientSecret: config.get('providers.vkontakte.appSecret'),
    callbackURL: config.get('providers.vkontakte.callbackURI'),
    profileFields: ['displayName', 'email'],
    session: false,
  }, function(accessToken, refreshToken, params, profile, done) {
    console.log(params, profile)
    authenticate('vkontakte', params.email, profile, done);
  }
);
