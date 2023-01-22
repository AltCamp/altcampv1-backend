const Passport = require('passport');
const mentorController = require('./mentorController');
const login = require('../../utils/authUtils').login;

const mentorRouter = require('express').Router();

// register
mentorRouter.post(
  '/register',
  Passport.authenticate('signup_mentor', { session: false }),
  mentorController.registerNewMentor
);

// login
mentorRouter.post('/login', async (req, res, next) =>
  Passport.authenticate('login_mentor', (err, user, info) => {
    login(req, res, { err, user, info });
  })(req, res, next)
);

module.exports = mentorRouter;
