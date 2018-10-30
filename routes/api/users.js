
import express from 'express';
import UserController from '../../server/controllers/UsersController';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200)
    .json({
      message: 'Welcome to Author\'s Haven, the community of great authors',
      status: 200
    });
});

router.post('/users/signup', UserController.signUp);

export default router;
