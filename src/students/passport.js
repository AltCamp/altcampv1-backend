const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const studentSchema = require('../model/regular-student');

// signup strategy
passport.use(
  'signup_student',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const student = await studentSchema.findOne({
          email: email,
        });

        if (student) {
          return done(null, false, { message: 'User already exists' });
        }

        const newStudent = await studentSchema.create({ ...req.body, password });

        return done(null, newStudent, { message: 'Student signup successful' });
      } catch (error) {
        done(error);
      }
    }
  )
);

// login strategy
passport.use(
  'login_student',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const student = await studentSchema.findOne({ email });

        if (!student) {
          return done(null, false, { message: 'User not found' });
        }

        const isMatch = await student.isValidPassword(password);

        if (!isMatch) {
          return done(null, false, { message: 'Invalid password' });
        }

        return done(null, student, { message: 'Student login successful' });
      } catch (error) {
        return done(error);
      }
    }
  )
);
