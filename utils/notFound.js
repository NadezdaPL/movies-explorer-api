const NotFound = require('../error/NotFound');
const { NOTFOUNDPAGE } = require('./constants');

module.exports.NotFound = (req, res, next) => {
  next(new NotFound(NOTFOUNDPAGE));
};
