const Card = require('../models/card');

const getCard = (_, res) => {
  Card.find({})
    .then((card) => {
      res.send({ data: card });
    })
    .catch(() => {
      res.status(500).send({ message: 'Ошибка по-умолчанию' });
    });
};

const createCard = (req, res) => {
  console.log(req.user._id);
  const { name, link } = req.body;
  const owner = req.user._id;
  const likes = [];
  Card.create({
    name, link, owner, likes,
  })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорретные данные' });
      } else {
        res.status(500).send({ message: 'Ошибка по-умолчанию' });
      }
    });
};
const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((card) => {
      res.send({ data: card });
    })

    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорретные данные' });
      } else if (err.message === 'NotFound') {
        res.status(404).send({ message: 'Карточка с указанным _id не найдена' });
      } else {
        res.status(500).send({ message: 'Ошибка по-умолчанию' });
      }
      console.log(err);
    });
};
const deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },

  )
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((card) => {
      res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорретные данные' });
      } else if (err.message === 'NotFound') {
        res.status(404).send({ message: 'Карточка с указанным _id не найдена' });
      } else {
        res.status(500).send({ message: 'Ошибка по-умолчанию' });
      }
    });
};
const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((card) => {
      res.send({ data: card });
    })

    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорретные данные' });
      } else if (err.message === 'NotFound') {
        res.status(404).send({ message: 'Карточка с указанным _id не найдена' });
      } else {
        res.status(500).send({ message: 'Ошибка по-умолчанию' });
      }
    });
};

module.exports = {
  getCard, createCard, deleteCard, likeCard, deleteLike,
};
