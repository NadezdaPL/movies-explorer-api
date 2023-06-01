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
  const owner = req.user._id;
  Movie.find({ owner })
    .then((card) => {
      res.status(CODE).send({ data: card });
    })
    .catch(next);
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
    .then((card) => res.status(CODE_CREATED).send(card))
    .catch((error) => {
      if (error instanceof ValidationError) {
        next(new BadRequest(`Переданы некорректные данные ${ERROR_CODE}`));
      } else {
        next(error);
      }
    });
};

module.exports.deleteMovieCards = (req, res, next) => {
  Movie.findById(req.params.cardId)
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        card.deleteOne();
        res.send('Карточка удалена');
      } else {
        throw new Forbidden(
          'Вы не можете удалить карточку другого пользователя',
        );
      }
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
