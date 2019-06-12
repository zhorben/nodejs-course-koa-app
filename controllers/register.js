const uuid = require('uuid/v4');
const User = require('../models/User');
const sendMail = require('../lib/sendMail');

module.exports = async function register(ctx) {
  try {
    const verificationToken = uuid();
    const user = new User({
      email: ctx.request.body.email,
      name: ctx.request.body.name,
      verificationToken,
    });
    
    await user.setPassword(ctx.request.body.password);
    await user.save();
    
    await sendMail({
      to: user.email,
      subject: 'Confirm your email',
      locals: { link: `http://localhost:3000/confirm/${verificationToken}` },
      template: 'confirm'
    });
    
    ctx.body = { status: 'ok' };
  } catch (err) {
    if (err.name !== 'ValidationError') throw err;

    ctx.status = 400;
    ctx.body = {
      errors: Object.keys(err.errors).reduce((errors, error) => {
        errors[error] = err.errors[error].message;
        return errors;
      }, {})
    };
  }
};
