const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ValidationError, CastError, DocumentNotFoundError } = require('mongoose').Error;

const { NODE_ENV, JWT_SECRET } = process.env;
const { DEV_SECRET, NODE_PRODUCTION } = require('../utils/config');
const User = require('../models/users');
const {
  CODE_CREATED,
  NOTFOUNDUSER,
  CONFLICTEMAIL,
  BADREQUESTDATA,
  BADREQUESTEMAILPASSWORD,
} = require('../utils/constants');
const NotFound = require('../error/NotFound');
const Conflict = require('../error/Conflict');
const BadRequest = require('../error/BadRequest');
const Unauthorized = require('../error/Unauthorized');

module.exports.getInfoProfile = (req, res, next) => {
  const { _id } = req.user;
  User.findById({ _id })
    .then((user) => res.send(user))
    .catch((error) => {
      if (error.name === DocumentNotFoundError) {
        next(
          new NotFound(NOTFOUNDUSER),
        );
      } else {
        next(error);
      }
    });
};

module.exports.getId = (req, res, next) => {
  const _id = req.params.userId;

  User.findById({ _id })
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw new NotFound(NOTFOUNDUSER);
      }
    })
    .catch(next);
};

const updateUser = (req, res, updateData, next) => {
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw new NotFound(NOTFOUNDUSER);
      }
    })
    .catch((error) => {
      if (error.code === 11000) {
        next(
          new Conflict(CONFLICTEMAIL),
        );
      } else if (error.name === ValidationError || error.name === CastError) {
        next(
          new BadRequest(BADREQUESTDATA),
        );
      } else {
        next(error);
      }
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  updateUser(req, res, { name, email }, next);
};

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new BadRequest(BADREQUESTDATA);
  }

  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      User
        .create({
          name,
          email,
          password: hash,
        })
        .then((newUser) => {
          res
            .status(CODE_CREATED)
            .send(newUser);
        })
        .catch((error) => {
          if (error.code === 11000) {
            next(
              new Conflict(CONFLICTEMAIL),
            );
          } else if (error.name === ValidationError) {
            next(
              new BadRequest(BADREQUESTDATA),
            );
          } else {
            next(error);
          }
        });
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new Unauthorized(BADREQUESTEMAILPASSWORD);
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return next(
              new Unauthorized(BADREQUESTEMAILPASSWORD),
            );
          }
          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === NODE_PRODUCTION ? JWT_SECRET : DEV_SECRET,
            { expiresIn: '7d' },
          );
          return res.send({ token });
        });
    })
    .catch(next);
};
