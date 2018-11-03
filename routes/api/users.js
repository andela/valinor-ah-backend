import express from 'express';
import path from 'path';

import verifyJWT from '../../server/middlewares/verifyJWT';
import UserValidation from '../../server/middlewares/UserValidation';
import UserController from '../../server/controllers/UsersController';
import facebookPassportRoutes from '../../server/config/facebookPassportRoutes';

const {
  validateUserSignUp,
  checkExistingEmail,
  validateUserLogin,
} = UserValidation;

const {
  userLogin,
  signUp,
  updateProfile,
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

// signup or login with facebook
router.get('/auth/facebook', facebookPassportRoutes.authenticate());

// facebook callback route
router.get('/auth/facebook/callback', facebookPassportRoutes.callback());

// update profile route
router.patch('/users/:userId', verifyJWT, updateProfile);

export default router;
