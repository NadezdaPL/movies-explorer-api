const { ValidationError, CastError } = require('mongoose').Error;
const BadRequest = require('../error/BadRequest');
const Conflict = require('../error/Conflict');
const Forbidden = require('../error/Forbidden');
const NotFound = require('../error/NotFound');
const Movie = require('../models/movies');
const {
  CODE,
  CODE_CREATED,
  FORBIDDENDELETE,
  CONFLICTEMOVIE,
  NOTFOUNDMOVIE,
  BADREQUESTDATA,
} = require('../utils/constants');

module.exports.getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .populate([{ path: 'owner', model: 'user' }])
    .then((card) => {
      res.status(CODE).send(card);
    })
    .catch(next);
};

module.exports.createMovieCards = (req, res, next) => {
  const owner = req.user._id;
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
  Movie.find({ owner, movieId })
    .then((addedCard) => {
      if (addedCard.length) {
        throw new Conflict(CONFLICTEMOVIE);
      } else {
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
          owner,
        })
          .then((card) => card.populate('owner'))
          .then((card) => res.status(CODE_CREATED).send(card))
          .catch((error) => {
            if (error.name === ValidationError) {
              next(new BadRequest(BADREQUESTDATA));
            } else {
              next(error);
            }
          });
      }
    })
    .catch(next);
};

module.exports.deleteMovieCards = (req, res, next) => {
  const _id = req.params.movieId;
  Movie.findOne({ _id })
    .populate([
      { path: 'owner', model: 'user' },
    ])
    .then((card) => {
      if (!card) {
        throw new NotFound(NOTFOUNDMOVIE);
      }
      if (card.owner._id.toString() !== req.user._id.toString()) {
        throw new Forbidden(FORBIDDENDELETE);
      }
      return card
        .deleteOne()
        .then((cardDeleted) => {
          res.send(cardDeleted);
        });
    })
    .catch((error) => {
      if (error === CastError) {
        next(new BadRequest(BADREQUESTDATA));
      } else {
        next(error);
      }
    });
};
