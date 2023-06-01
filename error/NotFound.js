const { ERROR_NOT_FOUND } = require('../utils/constants');

class NotFound extends Error {
  constructor(message) {
    super(message);
    this.type = ERROR_NOT_FOUND;
  }
}

module.exports = NotFound;
