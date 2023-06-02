const jwt = require('jsonwebtoken');

const { JWT_SECRET, NODE_ENV } = process.env;
const Unauthorized = require('../error/Unauthorized');
const { DEV_SECRET, NODE_PRODUCTION } = require('../utils/config');
const { UNAUTHORIZED } = require('../utils/constants');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new Unauthorized(UNAUTHORIZED));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === NODE_PRODUCTION ? JWT_SECRET : DEV_SECRET);
  } catch (err) {
    return next(new Unauthorized(UNAUTHORIZED));
  }

  req.user = payload;

  return next();
};
