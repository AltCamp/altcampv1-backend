const passport = require('passport');
const User = require('../model/student');
const JwtStrategy = require('passport-jwt').Strategy;

const config = require('../config/index');

const cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['jwt_token'];
  }
  return token;
};

const opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = config.jwt.secret;

exports.jwtPassport = passport.use(
  new JwtStrategy(opts, (payload, done) => {
    User.findById(payload.id, (err, user) => {
      if (err) {
        return done(err, false);
      } else if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  })
);

exports.verifyUser = passport.authenticate('jwt', { session: false });
