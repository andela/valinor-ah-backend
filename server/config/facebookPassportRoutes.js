import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import dotenv from 'dotenv';

import facebookCallback from '../helpers/facebookCallback';
import models from '../models';

const { User } = models;

dotenv.config();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findByPk(id).then((user) => {
    done(null, user);
  });
});

const facebookOptions = {
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: 'http://localhost:3000/api/v1/auth/facebook/callback',
  profileFields: ['id', 'emails', 'name', 'picture.type(large)']
};
passport.use(new FacebookStrategy(facebookOptions, facebookCallback));

const facebookPassportRoutes = {
  authenticate: () => passport.authenticate('facebook', {
    session: true,
    scope: ['email']
  }),
  callback: () => passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
};

export default facebookPassportRoutes;
