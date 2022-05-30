const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Unauthorized = require('../errors/Unauthorized');
const Error400 = require('../errors/error400');
const Error404 = require('../errors/error404');
const Error409 = require('../errors/error409');

const getUser = (_, res, next) => {
  User.find({})
    .then((user) => {
      res.send({ data: user });
    })
    .catch(next);
};

const getMyUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(new Error404('Пользователь с таким _id не найден'));
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new Error404('id пользователя указан не верно'));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!email || !password) {
    next(new Error400('Отсутствует email или пароль'));
  }
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      res.status(201).send({
        data: {
          name: user.name, about: user.about, avatar: user.avatar, email: user.email, _id: user.id,
        },
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new Error400('Переданы некорретные данные'));
      } else if (err.code === 11000) {
        next(new Error409('Пользователь с таким email уже существует'));
      } else {
        next(err);
      }
    });
};

function findUser(req, res, next) {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        next(new Error404('Пользователь не найден'));
      } else if (err.name === 'CastError') {
        next(new Error400('Нет пользователя с переданным id'));
      } else {
        next(err);
      }
    });
}
const updataUser = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    req.body,

    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new Error404('Переданы некорретные данные'));
      } else {
        next(err);
      }
    });
};
const updataAvatar = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    req.body,

    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      res.send({ avatar: user.avatar });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new Error404('Переданы некорретные данные'));
      } else {
        next(err);
      }
    });
};
const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!email || !password) {
        next(new Unauthorized('Ошибка авторизации'));
      }
      const token = jwt.sign({ _id: user._id }, 'secret-code', { expiresIn: '7d' });
      return res
        .cookie('jwt', token, {
          maxAge: 1000000,
          httpOnly: true,
        })
        .send({ message: 'Пользователь залогирован' });
    })
    .catch(next);
};

module.exports = {
  getUser, createUser, findUser, updataUser, updataAvatar, login, getMyUser,
};
