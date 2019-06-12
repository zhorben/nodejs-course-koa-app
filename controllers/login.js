const passport = require('../lib/passport');
const Session = require('../models/Session');
const uuid = require('uuid/v4');

module.exports = async function login(ctx, next) {
  await passport.authenticate('local', async (err, user, info) => {
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
