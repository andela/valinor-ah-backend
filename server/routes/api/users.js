import express from 'express';

import UserValidation from '../../middlewares/UserValidation';
import UserController from '../../controllers/UsersController';
import facebookPassportRoutes from '../../config/facebookPassportRoutes';
import { verifyToken } from '../../middlewares/tokenUtils';

const {
  validateUserSignUp,
  checkExistingEmail,
  validateUserLogin,
  validateUserUpdate,
} = UserValidation;
const {
  userLogin,
  signUp,
  verifyUser,
  updateProfile
} = UserController;

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200)
    .json({
      message: 'Welcome to Author\'s Haven, the community of great authors',
      status: 200
    });
});

// sign up route
router.post(
  '/users/signup',
  validateUserSignUp, checkExistingEmail, signUp
);
// login with email and password
router.post(
  '/users/login',
  validateUserLogin, userLogin
);

// verify users email
router.get('/users/verify', verifyToken, verifyUser);

// signup or login with facebook
router.get('/auth/facebook', facebookPassportRoutes.authenticate());

// facebook callback route
router.get('/auth/facebook/callback', facebookPassportRoutes.callback());

// update profile route
router.patch('/users/:userId', verifyToken, validateUserUpdate, updateProfile);

export default router;
