const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, profile, done) {
  if (!email) {
    return done(null, false, 'Не указан email');
  }
  
  try {
    let user = await User.findOne({email});

    if (user) {
      return done(null, user);
    }

    user = await User.create({
      email,
      name: profile.displayName,
    });
    done(null, user);
  } catch (err) {
    console.error(err);
    done(err);
  }
};
