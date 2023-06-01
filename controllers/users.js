const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const { ValidationError, CastError, DocumentNotFoundError } = require('mongoose').Error;
const { DEV_SECRET, NODE_PRODUCTION, ERROR_CONFLICT } = require('../utils/config');
const User = require('../models/users');
const {
  CODE_CREATED,
  ERROR_CODE,
  ERROR_NOT_FOUND,
} = require('../utils/constants');
const NotFound = require('../error/NotFound');
const BadRequest = require('../error/BadRequest');
const Conflict = require('../error/Conflict');

module.exports.getInfoProfile = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error instanceof DocumentNotFoundError) {
        next(new NotFound(`Пользователь не найден ${ERROR_NOT_FOUND}`));
      } else {
        next(error);
      }
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(
    userId,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error instanceof DocumentNotFoundError) {
        next(
          new NotFound(
            `Пользователь с указанным _id не найден ${ERROR_NOT_FOUND}`,
          ),
        );
      } else if (error instanceof CastError) {
        next(new BadRequest(`Переданы некорректные данные ${ERROR_CODE}`));
      } else if (error instanceof ValidationError) {
        next(new BadRequest(`Переданы некорректные данные ${ERROR_CODE}`));
      } else {
        next(error);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User
      .create({
        name,
        email,
        password: hash,
      }))
    .then((user) => {
      const data = user.toObject();
      delete data.password;
      res.status(CODE_CREATED).send({ data: user });
    })
    .catch((error) => {
      if (error instanceof ValidationError) {
        next(new BadRequest(`Переданы некорректные данные ${ERROR_CODE}`));
      } else if (error.code === 11000) {
        next(
          new Conflict(
            `Адрес электронной почты уже зарегистрирован ${ERROR_CONFLICT}`,
          ),
        );
      } else {
        next(error);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === NODE_PRODUCTION ? JWT_SECRET : DEV_SECRET,
        { expiresIn: '7d' },
      );
      return res.send({ token });
    })
    .catch(next);
};
