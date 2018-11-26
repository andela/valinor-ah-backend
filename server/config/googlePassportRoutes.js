import passport from 'passport';
import dotenv from 'dotenv';
import passportGoogleOauth from 'passport-google-oauth';
import googleCallback from '../helpers/googleCallback';

dotenv.config();
const GoogleStrategy = passportGoogleOauth.OAuth2Strategy;


const googleOptions = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.API_BASE_URL}/auth/google/callback`,
};

passport.use(new GoogleStrategy(googleOptions, googleCallback));

const googlePassportRoutes = {
  authenticate: () => passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/plus.login',
      'https://www.googleapis.com/auth/userinfo.email',
    ]
  }),
  callback: () => passport.authenticate('google', {
    failureRedirect: '/login'
  }),
};

export default googlePassportRoutes;
