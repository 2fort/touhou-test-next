const passport = require('passport');
const User = require('../models/User.js');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

const bcryptPr = require('../lib/bcryptPr');

const localLogin = new LocalStrategy({}, async (username, password, done) => {
  try {
    const user = await User.findOne({ username }).exec();

    if (!user) return done(null, false);

    const isMatch = await bcryptPr.compare(password, user.password);

    if (!isMatch) return done(null, false);

    return done(null, user);
  } catch (error) {
    return done(error);
  }
});


const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.SECRET,
};

const jwtLogin = new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = User.findById(payload.sub).exec();

    if (!user) return done(null, false);

    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
});

passport.use(jwtLogin);
passport.use(localLogin);
