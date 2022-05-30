const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/Unauthorized');

module.exports = (req, res, next) => {
  if (!req.cookies || !req.cookies.jwt) {
    return next(new Unauthorized('Авторизуйтесь'));
  }
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, 'secret-code');
    req.user = payload;
    return next();
  } catch (err) {
    return next(new Unauthorized('Авторизуйтесь'));
  }
};
