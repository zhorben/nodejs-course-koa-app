const passport = require('../lib/passport');
const config = require('config');
const compose = require('koa-compose');
const Session = require('../models/Session');
const uuid = require('uuid/v4');

exports.oauth = compose([
  async (ctx, next) => {
    const provider = ctx.request.body.provider;
    if (!config.get('providers.available').includes(provider)) {
      ctx.throw(400, {
        error: `Provider ${provider} is not supported`
      });
    }
  
    await next();
    
    ctx.status = 200;
    ctx.body = { status: 'ok', location: ctx.response.get('location') };
  },
  async (ctx, next) => {
    const provider = ctx.request.body.provider;
    await passport.authenticate(
      provider,
      config.get(`providers.${provider}.passportOptions`),
    )(ctx, next);
  }
]);

exports.oauth_callback = async function oauth_callback(ctx, next) {
  const provider = ctx.request.body.provider;
  
  ctx.query.code = ctx.request.body.code;
  
  await passport.authenticate(provider, async (err, user, info) => {
    console.log(err, user, info);
    
    if (err) throw err;
    
    if (!user) {
      ctx.status = 400;
      ctx.body = { error: info };
      return;
    }

    const token = uuid();
    await Session.create({ token, user });
    
    ctx.body = { token };
  })(ctx, next);
};
