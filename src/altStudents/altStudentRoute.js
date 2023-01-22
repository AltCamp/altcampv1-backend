const passport = require('passport');
const altStudentController = require('./altStudentController');
const login = require('../../utils/authUtils').login;

const altStudentRouter = require('express').Router();

// register
altStudentRouter.post(
  '/register',
  passport.authenticate('signup_alt', { session: false }),
  altStudentController.registerNewAltStudent
);

// login
altStudentRouter.post('/login', async (req, res, next) =>
  passport.authenticate('login_alt', (err, user, info) => {
    login(req, res, { err, user, info });
  })(req, res, next)
);

module.exports = altStudentRouter;
