const usersRouter = require('express').Router();

const { getInfoProfile, updateProfile } = require('../controllers/users');
const { validateProfile } = require('../middlewares/userValidator');

usersRouter.get('/me', getInfoProfile);
usersRouter.patch('/me', validateProfile, updateProfile);

module.exports = usersRouter;
