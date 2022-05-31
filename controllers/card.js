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
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new Error400('Переданы некорретные данные'));
      }
      next(err);
    });
};
const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .orFail(() => {
      throw new Error404('Карточка с указанным _id не найдена');
    })
    .then((card) => {
      if (String(req.user._id) !== String(card.owner)) {
        return next(new Error403('Нет прав на удаление'));
      }
      return card.remove()
        .then(() => res.send({ message: 'Карточка успешно удалена' }));
    })

    .catch((err) => {
      if (err.name === 'CastError') {
        next(new Error400('Переданы некорретные данные'));
      } else {
        next(err);
      }
    });
};
const deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },

  )
    .orFail(() => {
      throw new Error404('Передан несуществующий _id карточки');
    })
    .then((card) => {
      res.status(200).send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new Error400('Переданы некорретные данные'));
      } else if (err.message === 'NotFound') {
        next(new Error404('Передан несуществующий _id карточки'));
      }
      next(err);
    });
};
const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new Error404('Передан несуществующий _id карточки');
    })
    .then((card) => {
      res.send({ data: card });
    })

    .catch((err) => {
      if (err.message === 'NotFound') {
        next(new Error404('Передан несуществующий _id карточки'));
      } else if (err.name === 'CastError') {
        next(new Error400('Переданы некорретные данные'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCard, createCard, deleteCard, likeCard, deleteLike,
};
