const { ERROR_CODE } = require('../utils/constants');

class BadRequest extends Error {
  constructor(message) {
    super(message);
    this.type = ERROR_CODE;
  }
}

module.exports = BadRequest;
