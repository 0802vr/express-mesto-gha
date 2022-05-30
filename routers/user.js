const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUser, findUser, updataUser, updataAvatar, getMyUser,
} = require('../controllers/user');

router.get('/users/me', getMyUser);
router.get('/users', getUser);
router.get(
  '/users/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().length(24).hex().required(),
    }),
  }),
  findUser,
);

router.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  updataUser,
);

router.patch(
  '/users/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().pattern(/^https?:\/\/[a-z\d\-._~:/?#[\]@!$&'()*+,;=]+#?$/),
    }),
  }),
  updataAvatar,
);

module.exports = router;
