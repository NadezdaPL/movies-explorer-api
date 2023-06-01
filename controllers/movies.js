const { ValidationError, CastError, DocumentNotFoundError } = require('mongoose').Error;
const BadRequest = require('../error/BadRequest');
const Forbidden = require('../error/Forbidden');
const NotFound = require('../error/NotFound');
const Movie = require('../models/movies');
const {
  CODE,
  CODE_CREATED,
  ERROR_NOT_FOUND,
  ERROR_CODE,
} = require('../utils/constants');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((card) => {
      res.status(CODE).send({ data: card });
    })
    .catch((error) => {
      if (error instanceof DocumentNotFoundError) {
        next(new NotFound(`Фильмы не найдены ${ERROR_NOT_FOUND}`));
      } else {
        next(error);
      }
    });
};

module.exports.createMovieCards = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((card) => res.status(CODE_CREATED).send({ data: card }))
    .catch((error) => {
      if (error instanceof ValidationError) {
        next(new BadRequest(`Переданы некорректные данные ${ERROR_CODE}`));
      } else {
        next(error);
      }
    });
};

module.exports.deleteMovieCards = (req, res, next) => {
  const _id = req.params.cardId;

  Movie.findOne({ _id })
    .then((card) => {
      if (!card) {
        throw new Forbidden('Карточка была удалена');
      }
      if (card.owner._id.toString() !== req.user._id.toString()) {
        throw new Forbidden(
          'Вы не можете удалить карточку другого пользователя',
        );
      }
      return Movie.deleteOne({ _id }).then((cardDeleted) => {
        res.send({ data: cardDeleted });
      });
    })
    .catch((error) => {
      if (error instanceof DocumentNotFoundError) {
        next(
          new NotFound(`Карточка с указанным _id не найдена ${ERROR_NOT_FOUND}`),
        );
      } else if (error instanceof CastError) {
        next(new BadRequest(`Переданы некорректные данные ${ERROR_CODE}`));
      } else {
        next(error);
      }
    });
};
