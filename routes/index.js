const router = require('express').Router();
const signinRouter = require('./signin');
const signupRouter = require('./signup');
const moviesRouter = require('./movies');
const usersRouter = require('./users');
const auth = require('../middlewares/auth');
const NotFound = require('../error/NotFound');
const { NOTFOUNDPAGE } = require('../utils/constants');

router.use('/signin', signinRouter);
router.use('/signup', signupRouter);

router.use(auth);

router.use('/users', usersRouter);
router.use('/movies', moviesRouter);
router.use('*', (req, res, next) => {
  next(new NotFound(NOTFOUNDPAGE));
});

module.exports = router;
