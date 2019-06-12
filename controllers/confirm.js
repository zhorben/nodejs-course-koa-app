const User = require('../models/User');
const Session = require('../models/Session');
const uuid = require('uuid/v4');

module.exports = async function confirm(ctx) {
  const user = await User.findOne({
    verificationToken: ctx.request.body.verificationToken
  });
  
  if (!user) {
    ctx.throw(400, {
      error: 'Ссылка подтверждения недействительна или устарела'
    });
  }
  
  user.verificationToken = null;
  
  await user.save();
  
  const token = uuid();
  await Session.create({ token, user });
  
  ctx.body = { token };
};
