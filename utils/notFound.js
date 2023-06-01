const NotFound = require('../error/NotFound');

module.exports.errorNotFound = (req, res, next) => {
  next(new NotFound('По указанному адресу страница не найдена'));
};
