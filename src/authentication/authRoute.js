const express = require('express');
const Passport = require('passport');
const AuthController = require('./authController');

const AuthRouter = express.Router();

// register
AuthRouter.post(
  '/register',
  Passport.authenticate('signup', { session: false }),
  AuthController.signup
);

// login
AuthRouter.post('/login', async (req, res, next) =>
  Passport.authenticate('login', (err, user, info) => {
    AuthController.login(req, res, { err, user, info });
  })(req, res, next)
);

module.exports = AuthRouter;
