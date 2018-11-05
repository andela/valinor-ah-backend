import express from 'express';

import UserValidation from '../../server/middlewares/UserValidation';
import UserController from '../../server/controllers/UsersController';
import facebookPassportRoutes from '../../server/config/facebookPassportRoutes';

const {
  validateUserSignUp,
  checkExistingEmail,
  validateUserLogin,
  validateForgot,
  validateReset
} = UserValidation;
const {
  userLogin,
  signUp,
  resetPassword,
  forgotPassword
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

router.post(
  '/users/forgot',
  validateForgot,
  forgotPassword
);

router.post(
  '/users/reset/:token',
  validateReset,
  resetPassword
);

// signup or login with facebook
router.get(
  '/auth/facebook',
  facebookPassportRoutes.authenticate()
);

// facebook callback route
router.get(
  '/auth/facebook/callback',
  facebookPassportRoutes.callback()
);

export default router;
