const passport = require('passport');
const Account = require('../model/account');
const JwtStrategy = require('passport-jwt').Strategy;

const config = require('../config/index');

const tokenExtractor = function (req) {
  let authorization = req.headers.authorization;
  if (authorization) {
    authorization = authorization.split(' ')[1];
    return authorization;
  }
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['jwt_token'];
  }
  return token;
};

const opts = {};
opts.jwtFromRequest = tokenExtractor;
opts.secretOrKey = config.jwt.secret;

exports.jwtPassport = passport.use(
  new JwtStrategy(opts, (payload, done) => {
    Account.findById(payload.id, (err, user) => {
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
