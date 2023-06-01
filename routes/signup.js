const signupRouter = require('express').Router();

const { createUser } = require('../controllers/users');
const { validateSignup } = require('../middlewares/userValidator');

signupRouter.post('/', validateSignup, createUser);

module.exports = signupRouter;
