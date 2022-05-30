const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const validator = require('validator');
const Unauthorized = require('../errors/Unauthorized');

const userSchema = new mongoose.Schema({
  name: {
    required: true,
    minlength: 2,
    maxlength: 30,
    type: String,
    default: 'Жак-Ив Кусто',
    validate: /[ \wа-яА-ЯЁёё-]+/,
  },
  about: {
    required: true,
    minlength: 2,
    maxlength: 30,
    type: String,
    default: 'Исследователь',
    validate: /[ \wа-яА-ЯЁёё-]+/,
  },
  avatar: {
    type: String,
    required: true,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, 'Введите валидный e-mail'],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = (email, password) => {
  this.findOne({ email }).select('+password').then((user) => {
    if (!user) {
      return Promise.reject(new Unauthorized('Неправильные почта или пароль'));
    }
    return bcrypt.compare(password, user.password)
      .then((matched) => {
        if (!matched) {
          return Promise.reject(new Unauthorized('Неправильные почта или пароль'));
        }
        return user;
      });
  })
    .catch(() => Promise.reject(new Error('На сервере произошла ошибка')));
};

module.exports = mongoose.model('user', userSchema);
