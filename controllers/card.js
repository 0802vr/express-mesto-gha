const Card = require('../models/card');
const Error400 = require('../errors/error400');
const Error403 = require('../errors/error403');
const Error404 = require('../errors/error404');

const getCard = (_, res, next) => {
  Card.find({})
    .then((card) => {
      res.send({ data: card });
    })
    .catch(next);
};

const createCard = (req, res, next) => {
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
        next(new Error400('Переданы некорретные данные'));
      }
      next(err);
    });
};
const deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((card) => {
      if (String(req.user._id) === String(card.owner)) { res.send({ data: card }); } else {
        next(new Error403('Нет прав на удаление'));
      }
    })

    .catch((err) => {
      if (err.name === 'CastError') {
        next(new Error400('Переданы некорретные данные'));
      } if (err.message === 'NotFound') {
        next(new Error404('Карточка с указанным _id не найдена'));
      }
      next(err);
    });
};
const deleteLike = (req, res, next) => {
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
        next(new Error400('Переданы некорретные данные'));
      } else if (err.message === 'NotFound') {
        next(new Error404('Карточка с указанным _id не найдена'));
      } else {
        next(err);
      }
    });
};
const likeCard = (req, res, next) => {
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
        next(new Error400('Переданы некорретные данные'));
      } else if (err.message === 'NotFound') {
        next(new Error404('Карточка с указанным _id не найдена'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCard, createCard, deleteCard, likeCard, deleteLike,
};
