import express from 'express';
import UserValidation from '../../server/middlewares/UserValidation';
import UserController from '../../server/controllers/UsersController';

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

export default router;
