const moviesRouter = require('express').Router();

const {
  getMovies,
  createMovieCards,
  deleteMovieCards,
} = require('../controllers/movies');
const { validateMovieCards, validateMovieId } = require('../middlewares/movieValidator');

moviesRouter.get('/', getMovies);
moviesRouter.post('/', validateMovieCards, createMovieCards);
moviesRouter.delete('/:movieId', validateMovieId, deleteMovieCards);

module.exports = moviesRouter;
