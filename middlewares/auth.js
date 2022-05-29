const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/Unauthorized');

module.exports = (req, res, next) => {
  if (!req.cookies.jwt) {
    throw new Unauthorized('Авторизуйтесь');
  }
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, 'secret-code');
  } catch (err) {
    throw new Unauthorized('Авторизуйтесь');
  }
  req.user = payload;
  return next();
};
