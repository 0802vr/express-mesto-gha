const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const validator = require('validator');
const Unauthorized = require('../errors/Unauthorized');

const userSchema = new mongoose.Schema({
  name: {
    minlength: 2,
    maxlength: 30,
    type: String,
    default: 'Жак-Ив Кусто',

  },
  about: {
    minlength: 2,
    maxlength: 30,
    type: String,
    default: 'Исследователь',

  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: (v) => validator.isURL(v),
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: (v) => validator.isEmail(v),
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password').then((user) => {
    if (!user) {
      throw new Unauthorized('Неправильные почта или пароль');
    }
    return bcrypt.compare(password, user.password)
      .then((matched) => {
        if (!matched) {
          throw new Unauthorized('Неправильные почта или пароль');
        }
        return user;
      });
  });
};
module.exports = mongoose.model('user', userSchema);
