const { ValidationError, CastError } = require('mongoose').Error;
const {
  ERROR_CODE,
  ERROR_CONFLICT,
  ERROR_INTERNAL_SERVER,
  BADREQUESTDATA,
  CONFLICTEMAIL,
  SERVERERROR,
} = require('../utils/constants');
const Unauthorized = require('../error/Unauthorized');
const NotFound = require('../error/NotFound');
const Forbidden = require('../error/Forbidden');
const Conflict = require('../error/Conflict');

module.exports = function errorHandler(err, res) {
  if (err instanceof CastError || err instanceof ValidationError) {
    return res.status(ERROR_CODE).send(BADREQUESTDATA);
  }

  if (
    err instanceof NotFound
    || err instanceof Unauthorized
    || err instanceof Conflict
    || err instanceof Forbidden
  ) {
    const { message } = err;
    return res.status(err.type).send({ message });
  }

  if (err.code === 11000) {
    return res.status(ERROR_CONFLICT).send(CONFLICTEMAIL);
  }

  return res
    .status(ERROR_INTERNAL_SERVER)
    .send(SERVERERROR);
};
