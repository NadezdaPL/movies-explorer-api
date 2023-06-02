const router = require('express').Router();
const signinRouter = require('./signin');
const signupRouter = require('./signup');
const moviesRouter = require('./movies');
const usersRouter = require('./users');
const auth = require('../middlewares/auth');
const NotFound = require('../error/NotFound');
const { NOTFOUNDPAGE } = require('../utils/constants');
const errorHandler = require('../middlewares/errorHandler');

router.use('/signin', signinRouter);
router.use('/signup', signupRouter);

router.use(auth);

router.use('/users', usersRouter);
router.use('/movies', moviesRouter);
router.use('*', (req, res) => {
  const newError = new NotFound(NOTFOUNDPAGE);
  errorHandler(newError, res);
});

module.exports = router;
