const {
  ERROR_INTERNAL_SERVER,
  SERVERERROR,
} = require('../utils/constants');

module.exports = function errorHandler(err, req, res, next) {
  const { type = ERROR_INTERNAL_SERVER, message } = err;
  res.status(type).send({
    message: type === ERROR_INTERNAL_SERVER ? SERVERERROR : message,
  });

  next();
};
