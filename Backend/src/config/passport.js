import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/user.model.js';
import config from './config.js';

passport.use(new GoogleStrategy({
  clientID: config.GOOGLE_CLIENT_ID,
  clientSecret: config.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Try to find existing Google user
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      // Email already registered? Link the accounts
      user = await User.findOne({ email: profile.emails[0].value });
      if (user) {
        user.googleId = profile.id;
        await user.save();
      } else {
        // Brand new user
        user = await User.create({
          googleId: profile.id,
          email: profile.emails[0].value,
          username: profile.displayName.replace(/\s+/g, '_').toLowerCase(),
        });
      }
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

export default passport;