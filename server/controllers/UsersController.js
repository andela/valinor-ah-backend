import bcrypt from 'bcrypt-nodejs';
import models from '../models';
import createToken from '../helpers/createToken';
import sendEmail from '../helpers/sendEmail';
import verifyEmailMessage from '../helpers/verifyEmailMessage';

const { User } = models;

/**
 * @class UsersController
 * @description User related Operations
 */
class UsersController {
/**
 * @description
 * @param {object} req - request object
 * @param {object} res - response object
 * @returns {object} - returns user
 */
  static signUp(req, res) {
    const { fullName, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(`${password}`);
    const lifeSpan = 60 * 60 * 24;
    return User
      .create({
        fullName,
        email,
        password: hashedPassword
      })
      .then((user) => {
        const token = createToken(user.id, lifeSpan);
        sendEmail(user, verifyEmailMessage(token));
        res.status(201).json({
          status: 'success',
          message: 'New user created successfully',
          user: {
            id: user.id,
            fullName,
            email,
            confirmEmail: user.confirmEmail,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            token,
          }
        });
      })
      .catch(err => res.status(500)
        .json({
          error: {
            message: err.message,
          },
        }));
  }
}

export default UsersController;
