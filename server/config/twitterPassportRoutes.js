import passport from 'passport';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import dotenv from 'dotenv';

import twitterCallback from '../helpers/twitterCallback';

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

const twitterOptions = {
  consumerKey: process.env.TWITTER_APP_ID,
  consumerSecret: process.env.TWITTER_APP_SECRET,
  callbackURL: `${process.env.API_BASE_URL}/auth/twitter/callback`,
  includeEmail: true
};
passport.use(new TwitterStrategy(twitterOptions, twitterCallback));

const twitterPassportRoutes = {
  authenticate: () => passport.authenticate('twitter', {
    session: true,
    scope: ['include_email=true']
  }),
  callback: () => passport.authenticate('twitter', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
};

export default twitterPassportRoutes;
