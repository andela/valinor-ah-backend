import express from 'express';

import FollowController from '../../controllers/FollowController';
import UserValidation from '../../middlewares/UserValidation';
import UsersController from '../../controllers/UsersController';
import facebookPassportRoutes from '../../config/facebookPassportRoutes';
import googlePassportRoutes from '../../config/googlePassportRoutes';
import { verifyToken } from '../../middlewares/tokenUtils';
import twitterPassportRoutes from '../../config/twitterPassportRoutes';
import confirmUser from '../../middlewares/confirmUser';
import validateResourceId from '../../middlewares/validateResourceId';
import validateAccess from '../../middlewares/validateAccess';

const {
  validateUserSignUp,
  checkExistingEmail,
  validateUserLogin,
  validateUserUpdate,
  validateFollowUserUrl
} = UserValidation;
const {
  signUp,
  userLoginStart,
  userLoginEnd,
  verifyUser,
  updateProfile,
  getSingleProfile,
  getUserProfiles,
  fetchAuthors,
  modifyAccount,
  deleteAccount,
  socialEnd
} = UsersController;

const {
  followAuthor,
  displayFollowView
} = FollowController;

const users = express.Router();

users.get('/', (req, res) => {
  res.status(200)
    .json({
      message: 'Welcome to Author\'s Haven, the community of great authors',
      status: 200
    });
});

// sign up route
users.post(
  '/users/signup',
  validateUserSignUp, checkExistingEmail, signUp
);

// login start
users.post('/users/login', validateUserLogin, userLoginStart);

// login with email link
users.get('/users/login', verifyToken, userLoginEnd);

// verify users email
users.get('/users/verify', verifyToken, verifyUser);

// get authors
users.get('/users/authors', fetchAuthors);

// signup or login with facebook
users.get('/auth/facebook', facebookPassportRoutes.authenticate());

// facebook callback route
users.get(
  '/auth/facebook/callback',
  facebookPassportRoutes.callback(),
  socialEnd
);

// update profile route
users.patch(
  '/users/:userId',
  verifyToken, validateResourceId, confirmUser, validateUserUpdate,
  updateProfile
);

// route for twitter authentication and login
users.get('/auth/twitter', twitterPassportRoutes.authenticate());

// handle the callback after twitter has authenticated the user
users.get('/auth/twitter/callback', twitterPassportRoutes.callback());

// signup or login with google
users.get('/auth/google', googlePassportRoutes.authenticate());

// google callback route
users.get('/auth/google/callback', googlePassportRoutes.callback(), socialEnd);

// get all user profiles
users.get('/users', verifyToken, confirmUser, getUserProfiles);

// get a single user profile
users.get(
  '/users/:userId',
  verifyToken, validateResourceId, confirmUser, getSingleProfile,
);

// follow an author
users.post(
  '/users/follow/:authorId',
  validateFollowUserUrl, verifyToken, followAuthor
);

// fetch followers and following
users.get(
  '/users/follow/:userId',
  validateResourceId, displayFollowView
);

// deactivate a user account
users.patch(
  '/users/:userId/account/:action',
  verifyToken,
  validateResourceId,
  validateAccess(['ADMIN', 'USER', 'AUTHOR']),
  modifyAccount
);

// delete account
users.get(
  '/users/account/delete',
  verifyToken, deleteAccount
);

export default users;
