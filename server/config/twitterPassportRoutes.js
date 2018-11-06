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

// eslint-disable-next-line max-len
const callbackURL = process.env.NODE_ENV === 'production' ? process.env.TWITTER_CALL_BACK_URL_PROD : process.env.TWITTER_CALL_BACK_URL_DEV;
const twitterOptions = {
  consumerKey: process.env.TWITTER_APP_ID,
  consumerSecret: process.env.TWITTER_APP_SECRET,
  callbackURL,
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
    failureRedirect: '/users/login'
  })
};

export default twitterPassportRoutes;
