const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const altStudentSchema = require('../model/alt-student');

// signup strategy
passport.use(
  'signup_alt',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const altStudent = await altStudentSchema.findOne({
          email: email,
        });

        if (altStudent) {
          return done(null, false, { message: 'User already exists' });
        }

        const newaltStudent = await altStudentSchema.create({
          ...req.body,
          password,
        });

        return done(null, newaltStudent, {
          message: 'altStudent signup successful',
        });
      } catch (error) {
        done(error);
      }
    }
  )
);

// login strategy
passport.use(
  'login_alt',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const altStudent = await altStudentSchema.findOne({ email });

        if (!altStudent) {
          return done(null, false, { message: 'User not found' });
        }

        const isMatch = await altStudent.isValidPassword(password);

        if (!isMatch) {
          return done(null, false, { message: 'Invalid password' });
        }

        return done(null, altStudent, {
          message: 'AltStudent login successful',
        });
      } catch (error) {
        return done(error);
      }
    }
  )
);
