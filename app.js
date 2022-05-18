const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const user = require('./routers/user');
const card = require('./routers/card');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.user = {
    _id: '6284da74d4a3c3e0a2f8cba7',
  };
  next();
});
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
