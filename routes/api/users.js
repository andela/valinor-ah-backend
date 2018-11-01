import express from 'express';

import UserValidation from '../../server/middlewares/UserValidation';
import UserController from '../../server/controllers/UsersController';
import { facebookRoutes } from '../../server/config/passport';

const {
  validateUserSignUp,
  checkExistingEmail,
  validateUserLogin
} = UserValidation;
const { userLogin, signUp } = UserController;
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
router.get('/auth/facebook', facebookRoutes.authenticate());

// facebook callback route
router.get('/auth/facebook/callback', facebookRoutes.callback());

// facebook success page
router.get('/auth/facebook/success', (req, res) => res.status(200).json({
  message: 'Successfully logged in with facebook!',
  status: 200
}));

// facebook failure page
router.get('/auth/facebook/failure', (req, res) => res.status(401).json({
  message: 'Failed logged in with facebook!',
  status: 401
}));

export default router;
