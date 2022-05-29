const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const user = require('./routers/user');
const card = require('./routers/card');
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/user');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use('/', user);
app.use('/', card);
app.use((_, res) => {
  res.status(404).send({ message: 'Страницы не существует' });
});

const { PORT = 3000 } = process.env;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Server up!');
});
