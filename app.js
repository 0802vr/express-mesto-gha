const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const user = require('./routers/user');
const card = require('./routers/card');
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/user');
const Error404 = require('./errors/error404');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);

app.use('/', auth, user);
app.use('/', auth, card);

app.use('*', () => {
  throw new Error404('Такой страницы не существует');
});

app.use(errors());

app.use((err, _, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send(
    { message: statusCode === 500 ? 'На сервере произошла ошибка' : message },
  );
  next();
});

const { PORT = 3000 } = process.env;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Server up!');
});
