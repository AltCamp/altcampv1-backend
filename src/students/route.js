const passport = require('passport');
const studentController = require('./studentController');
const login = require('../../utils/authUtils').login;

const studentRouter = require('express').Router();

// register
studentRouter.post(
  '/register',
  passport.authenticate('signup_student', { session: false }),
  studentController.registerNewStudent
);

// login
studentRouter.post('/login', async (req, res, next) =>
  passport.authenticate('login_student', (err, user, info) => {
    login(req, res, { err, user, info });
  })(req, res, next)
);

module.exports = studentRouter;
