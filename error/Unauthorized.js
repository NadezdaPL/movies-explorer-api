const { ERROR_UNAUTHORIZED } = require('../utils/constants');

class Unauthorized extends Error {
  constructor(message) {
    super(message);
    this.type = ERROR_UNAUTHORIZED;
  }
}

module.exports = Unauthorized;
