const { ERROR_INTERNAL_SERVER } = require('../utils/constants');

module.exports = (err, req, res, next) => {
  const { statusCode = ERROR_INTERNAL_SERVER, message } = err;
  res.status(statusCode).send({
    message: statusCode === ERROR_INTERNAL_SERVER
      ? 'На сервере произошла ошибка'
      : message,
  });

  return next();
};
