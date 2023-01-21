const Passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const MentorSchema = require('../model/mentor');
const StudentSchema = require('../model/regular-student');
const AltStudentSchema = require('../model/alt-student');
const CONFIG = require('../../config');

const jwtOptions = {
  secretOrKey: CONFIG.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

// JWT strategy
Passport.use(
  new JwtStrategy(jwtOptions, async (token, done) => {
    try {
      return done(null, token.user);
    } catch (error) {
      done(error);
    }
  })
);

// signup strategy
Passport.use(
  'signup',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const mentor = await MentorSchema.findOne({
          email: email.toLowerCase(),
        });

        const student = await StudentSchema.findOne({
          email: email.toLowerCase(),
        });

        const altStudent = await AltStudentSchema.findOne({
          email: email.toLowerCase(),
        });

        if (mentor || student || altStudent) {
          return done(null, false, { message: 'User already exists' });
        }

        const newUser = await StudentSchema.create({ ...req.body, password });

        return done(null, newUser, { message: 'Student signup successful' });
      } catch (error) {
        done(error);
      }
    }
  )
);

// login strategy
Passport.use(
  'login',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const mentor = await MentorSchema.findOne({ email });

        const student = await StudentSchema.findOne({ email });

        const altStudent = await AltStudentSchema.findOne({ email });

        if (!mentor && !student && !altStudent) {
          return done(null, false, { message: 'User not found' });
        }

        let isMatch = false;
        switch (true) {
          case mentor:
            isMatch = await mentor.isValidPassword(password);
            if (!isMatch) {
              return done(null, false, { message: 'Invalid password' });
            }
            return done(null, mentor, { message: 'Mentor login successful' });
          case student:
            isMatch = await student.isValidPassword(password);
            if (!isMatch) {
              return done(null, false, { message: 'Invalid password' });
            }
            return done(null, student, { message: 'Student login successful' });
          case altStudent:
            isMatch = await altStudent.isValidPassword(password);
            if (!isMatch) {
              return done(null, false, { message: 'Invalid password' });
            }
        }

        return done(null, student, {
          message: 'Student login successful',
        });
      } catch (error) {
        return done(error);
      }
    }
  )
);
