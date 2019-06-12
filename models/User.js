const mongoose = require('../lib/mongoose');
const crypto = require('crypto');
const config = require('config');

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: 'E-mail пользователя не должен быть пустым',
    validate: [
      {
        validator(value) {
          return /^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/.test(value);
        },
        message: 'Некорректный email'
      }
    ],
    unique: 'Такой email уже существует'
  },
  name: {
    type: String,
    required: 'У пользователя должно быть имя',
    unique: 'Такое имя уже существует'
  },
  verificationToken: {
    type: String,
    index: true,
  },
  passwordHash: {
    type: String,
  },
  salt: {
    type: String
  },
}, {
  timestamps: true,
});

function generatePassword(salt, password) {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(
      password, salt,
      config.get('crypto.hash.iterations'), config.get('crypto.hash.length'),
      'sha512',
      (err, key) => {
        if (err) return reject(err);
        resolve(key.toString('hex'));
      }
    );
  });
}

schema.methods.setPassword = async function setPassword(password) {
  if (!password) {
    return this.invalidate('password', 'Пароль обязателен');
  }
  
  if (password.length < 6) {
    return this.invalidate('password', 'Пароль должен быть не менее 6 символов', password.length);
  }
  
  this.salt = crypto.randomBytes(config.get('crypto.hash.length')).toString('hex');
  this.passwordHash = await generatePassword(this.salt, password);
};

schema.methods.checkPassword = async function(password) {
  if (!password) return false;
  
  const hash = await generatePassword(this.salt, password);
  return hash === this.passwordHash;
};


module.exports = mongoose.model('User', schema);
