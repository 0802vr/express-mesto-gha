const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCard, createCard, deleteCard, likeCard, deleteLike,
} = require('../controllers/card');

router.get('/cards', getCard);
router.post(
  '/cards',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      link: Joi.string().required().pattern(/^https?:\/\/[a-z\d\-._~:/?#[\]@!$&'()*+,;=]+#?$/),
    }),
  }),
  createCard,
);

router.delete(
  '/cards/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex().required(),
    }),
  }),
  deleteCard,
);

router.put(
  '/cards/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex().required(),
    }),
  }),
  likeCard,
);

router.delete(
  '/cards/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex().required(),
    }),
  }),
  deleteLike,
);

module.exports = router;
