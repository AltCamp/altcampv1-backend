const passport = require('passport');
const altStudentController = require('./altStudentController');
const login = require('../../utils/authUtils').login;

const student = require('express').Router();

// register
student.post(
  '/register',
  passport.authenticate('signup_alt', { session: false }),
  altStudentController.registerNewAltStudent
);

// login
student.post('/login', async (req, res, next) =>
  passport.authenticate('login_alt', (err, user, info) => {
    login(req, res, next, { err, user, info });
  })(req, res, next)
);

module.exports = student;
