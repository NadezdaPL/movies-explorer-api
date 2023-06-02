const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const { DEV_SECRET, NODE_PRODUCTION } = require('../utils/config');
const User = require('../models/users');
const {
  CODE_CREATED,
  NOTFOUNDUSER,
} = require('../utils/constants');
const NotFound = require('../error/NotFound');

module.exports.getInfoProfile = (req, res, next) => {
  const { _id } = req.user;
  User.findById({ _id })
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw next(new NotFound(NOTFOUNDUSER));
      }
    })
    .catch(next);
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
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  updateUser(req, res, { name, email }, next);
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
    .then((user) => res.status(CODE_CREATED).send(user))
    .catch(next);
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
