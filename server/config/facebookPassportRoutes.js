import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import dotenv from 'dotenv';

import facebookCallback from '../helpers/facebookCallback';

dotenv.config();

const facebookOptions = {
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: `${process.env.API_BASE_URL}/auth/facebook/callback`,
  profileFields: ['id', 'emails', 'name', 'picture.type(large)']
};
passport.use(new FacebookStrategy(facebookOptions, facebookCallback));

const facebookPassportRoutes = {
  authenticate: () => passport.authenticate('facebook', {
    session: false,
    scope: ['email']
  }),
  callback: () => passport.authenticate('facebook', {
    failureRedirect: '/login'
  })
};

export default facebookPassportRoutes;
