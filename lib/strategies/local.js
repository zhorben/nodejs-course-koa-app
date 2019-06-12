const LocalStrategy = require('passport-local');
const User = require('../../models/User');

module.exports = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    session: false,
  },
  async function(email, password, done) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return done(null, false, 'Нет такого пользователя');
      }
      
      const isValidPassword = await user.checkPassword(password);
      
      if (!isValidPassword) {
        return done(null, false, 'Пароль неверен');
      }
      
      if (user.verificationToken) {
        return done(null, false, 'Подтвердите email');
      }

      return done(null, user);
    } catch (err) {
      console.error(err);
      done(err);
    }
  }
);
