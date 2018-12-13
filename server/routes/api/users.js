import express from 'express';

import FollowController from '../../controllers/FollowController';
import UserValidation from '../../middlewares/UserValidation';
import UsersController from '../../controllers/UsersController';
import NotificationController from '../../controllers/NotificationController';
import { verifyToken } from '../../middlewares/tokenUtils';
import confirmUser from '../../middlewares/confirmUser';
import validateResourceId from '../../middlewares/validateResourceId';
import validateAccess from '../../middlewares/validateAccess';

const {
  validateUserSignUp,
  checkExistingEmail,
  validateUserLogin,
  validateUserUpdate,
  validateFollowUserUrl,
  validateNotificationSetting,
  validateSocialSignup
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
  socialSignup
} = UsersController;

const {
  followAuthor,
  displayFollowView
} = FollowController;

const users = express.Router();

const { updateNotificationStatus } = NotificationController;


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

// update profile route
users.patch(
  '/users/:userId',
  verifyToken, validateResourceId, confirmUser, validateUserUpdate,
  updateProfile
);

// social signup
users.post('/auth/social', validateSocialSignup, socialSignup);


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

// user opt-in or opt-out of notification route
users.put(
  '/users',
  verifyToken,
  confirmUser,
  validateNotificationSetting,
  updateNotificationStatus
);

export default users;
