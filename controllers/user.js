const User = require('../models/user');

const getUser = (_, res) => {
  User.find({})
    .then((user) => {
      res.send({ data: user });
    })
    .catch(() => {
      res.status(500).send({ message: 'Ошибка по-умолчанию' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорретные данные' });
      } else {
        res.status(500).send({ message: 'Ошибка по-умолчанию' });
      }
    });
};
const findUser = (req, res) => {
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
};
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

module.exports = {
  getUser, createUser, findUser, updataUser, updataAvatar,
};
