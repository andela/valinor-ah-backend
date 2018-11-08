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
router.post(
  '/users/signup',
  validateUserSignUp, checkExistingEmail, signUp
);
router.post(
  '/users/login',
  validateUserLogin, userLogin
);

router.get('/users/verify', verifyToken, verifyUser);

// signup or login with facebook
router.get('/auth/facebook', facebookPassportRoutes.authenticate());

// facebook callback route
router.get('/auth/facebook/callback', facebookPassportRoutes.callback());

// update profile route
router.patch('/users/:userId', verifyJWT, validateUserUpdate, updateProfile);

export default router;
