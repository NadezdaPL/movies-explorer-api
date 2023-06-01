const { ERROR_INTERNAL_SERVER } = require('../utils/constants');

module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode || ERROR_INTERNAL_SERVER;
  const errMessage = statusCode === ERROR_INTERNAL_SERVER
    ? 'На сервере произошла ошибка'
    : err.message;
  res.status(statusCode).send({
    message: errMessage,
  });

  return next();
};
