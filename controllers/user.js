const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Unauthorized = require('../errors/Unauthorized');

const getUser = (_, res) => {
  User.find({})
    .then((user) => {
      res.send({ data: user });
    })
    .catch(() => {
      res.status(500).send({ message: 'Ошибка по-умолчанию' });
    });
};

const getMyUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь с таким _id не найден' });
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'id пользователя указан не верно' });
      } else {
        next(err);
      }
    });
};

const createUser = (req, res) => {
  const {
    name, about, avatar, email,
  } = req.body;
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
        res.status(400).send({ message: 'Переданы некорретные данные' });
      } else {
        res.status(500).send({ message: 'Ошибка по-умолчанию' });
      }
    });
};

function findUser(req, res) {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        res.status(404).send({ message: 'Пользователь не найден' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Нет пользователя с переданным id' });
      } else {
        res.status(500).send({ message: 'Ошибка по-умолчанию' });
      }
    });
}
const updataUser = (req, res) => {
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
        res.status(400).send({ message: 'Переданы некорретные данные' });
      } else {
        res.status(500).send({ message: 'Ошибка по-умолчанию' });
      }
    });
};
const updataAvatar = (req, res) => {
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
        res.status(400).send({ message: 'Переданы некорретные данные' });
      } else {
        res.status(500).send({ message: 'Ошибка по-умолчанию' });
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
