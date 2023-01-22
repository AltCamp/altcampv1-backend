const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const MentorSchema = require('../model/mentor');

// signup strategy
passport.use(
  'signup_mentor',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const mentor = await MentorSchema.findOne({
          email: email,
        });

        if (mentor) {
          return done(null, false, { message: 'User already exists' });
        }

        const newMentor = await MentorSchema.create({ ...req.body, password });

        return done(null, newMentor, { message: 'Mentor signup successful' });
      } catch (error) {
        done(error);
      }
    }
  )
);

// login strategy
passport.use(
  'login_mentor',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const mentor = await MentorSchema.findOne({ email });

        if (!mentor) {
          return done(null, false, { message: 'User not found' });
        }

        const isMatch = await mentor.isValidPassword(password);

        if (!isMatch) {
          return done(null, false, { message: 'Invalid password' });
        }

        return done(null, mentor, { message: 'Mentor login successful' });
      } catch (error) {
        return done(error);
      }
    }
  )
);
