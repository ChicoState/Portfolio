const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const User = require('./models/user');
require('dotenv').config();

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.access_token;
  }
  return token;
};

// authorization
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: `${process.env.SECRET}`,
    },
    (payload, done) => {
      User.findById({ _id: payload.id }, (err, user) => {
        if (err) {
          return done(err, false);
        }
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      });
    },
  ),
);

// authenticated local strategy using username and password
passport.use(
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    (email, password, done) =>
      User.findOne({ email }, (err, user) => {
        // something went wrong with database
        if (err) {
          return done(err);
        }
        // if no user exist
        if (!user) {
          return done(null, false);
        }
        // check if password is correct
        return user.comparePassword(password, done);
      }),
  ),
);
