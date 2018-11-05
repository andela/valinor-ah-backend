import bcrypt from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';
import models from '../models';
import createToken from '../helpers/createToken';
import sendEmail from '../helpers/sendEmail';
import verifyEmailMessage from '../helpers/verifyEmailMessage';
import resetPasswordEmail from '../helpers/resetPasswordEmail';
import forgotPasswordEmail from '../helpers/forgotPasswordEmail';

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
            roleId: user.roleId,
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

  /**
    * @description - This method logs in user and return a token.
    * @param {object} req - The request object bearing the email and password.
    * @param {object} res - The response object that is returned as json.
    * @returns {object} - The object with message.
    * @memberOf UserController
    * @static
    */
  static userLogin(req, res) {
    const { email, password } = req.body;
    return User.findOne({
      where: {
        email
      }
    })
      .then((userFound) => {
        if (!userFound || !bcrypt.compareSync(password, userFound.password)) {
          return res.status(401).json({
            errors: {
              message: ['Invalid email or password']
            }
          });
        }
        if (bcrypt.compareSync(password, userFound.password)) {
          const {
            id,
            fullName,
            roleId
          } = userFound;
          const lifeSpan = 60 * 60 * 24;
          return res.status(200).json({
            status: 'success',
            message: 'you are logged in',
            user: {
              fullName,
              email,
              roleId,
              token: createToken(id, lifeSpan)
            }
          });
        }
      })
      .catch(error => res.status(500).json({
        errors: {
          message: ['error reading user table', `${error}`]
        }
      }));
  }

  /**
 * @description - Reoute handler to send password reset link
 * @param {object} req - request object
 * @param {object} res - response object
 * @returns {object} - returns user
 */
  static forgotPassword(req, res) {
    const { email } = req.body;
    const lifeSpan = '1h'; // token expires after 1 hour

    User.findOne({
      where: {
        email
      }
    })
      .then((userFound) => {
        if (!userFound) {
          return res.status(404).json({
            errors: {
              message: ['No account with that email address exists']
            }
          });
        }

        const userId = userFound.id;
        const token = createToken(userId, lifeSpan);
        const forgotUrl = `${req.protocol}://${req.host}/password_reset`
        + `/${token}`;

        const user = {
          id: userId,
          email
        };

        const message = forgotPasswordEmail(forgotUrl);

        // send email
        sendEmail(user, message);

        res.status(200).send({
          status: 'success',
          message: ['Password reset email sent successfully'],
          token
        });
      })
      .catch((err) => {
        res.status(500)
          .json({
            error: {
              message: err.message,
            },
          });
      });
  }

  /**
   * @description - Route handler to reset user password
   * @param {object} req - request object
   * @param {object} res - response object
   * @returns {object} - returns user
   */
  static resetPassword(req, res) {
    const { password, confirmPassword } = req.body;
    const { token } = req.params;

    if (password === confirmPassword) {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.status(400).send({
            status: 'failure',
            message: ['Password reset token is invalid or has expired']
          });
        }

        const userId = decoded.id;
        User.findOne({
          where: {
            id: userId
          },
          attributes: ['id', 'fullName', 'email', 'avatarUrl', 'bio']
        })
          .then((user) => {
            if (!user) {
              return res.status(404).send({
                status: 'failure',
                message: ['User not found'],
              });
            }

            const hashedPassword = bcrypt.hashSync(`${password}`);

            user.update(
              { password: hashedPassword }
            )
              .then(() => {
                const message = resetPasswordEmail();

                // send email
                sendEmail(user, message);

                res.status(200).send({
                  status: 'success',
                  message: ['password reset was successful'],
                  user: {
                    id: user.id,
                    fullName: user.fullName,
                    email: user.email,
                    bio: user.bio
                  }
                });
              })
              .catch((err) => {
                res.status(500)
                  .json({
                    error: {
                      message: err.message,
                    },
                  });
              });
          });
      });
    } else {
      return res.status(400).send({
        status: 'failure',
        message: ['Passwords did not match']
      });
    }
  }
}

export default UsersController;
