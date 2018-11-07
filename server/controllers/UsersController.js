import bcrypt from 'bcrypt-nodejs';
import { Op } from 'sequelize';
import cloudinary from 'cloudinary';

import models from '../models';
import sendEmail from '../helpers/sendEmail';
import verifyEmailMessage from '../helpers/verifyEmailMessage';
import { createToken, verifyToken } from '../helpers/tokenUtils';
import cloudinaryConfig from '../config/cloudinaryConfig';

cloudinary.config(cloudinaryConfig);

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
        sendEmail(
          user,
          verifyEmailMessage(
            token,
            req.protocol,
            // req.headers.host
          )
        );
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
          errors: {
            message: [err.message]
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
      .catch(err => res.status(500).json({
        errors: {
          message: [err.message]
        }
      }));
  }

  /**
   * This controller updates a users profile
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {void}
   */
  static async updateProfile(req, res, next) {
    // check if request token id matches id of account to be updated
    const { userId } = req.params;
    const { id } = res.locals.payload;
    if (id !== parseInt(userId, 10)) {
      const error = new Error('can\'t update another user\'s profile');
      error.status = 403;
      return next(error);
    }

    // check if user exists
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        const error = new Error('user not found');
        error.status = 404;
        return next(error);
      }
    } catch (error) {
      return next(error);
    }

    // check that the request body contains only valid columns
    const updateData = req.body;
    const profileFields = [
      'fullName',
      'email',
      'bio',
      'avatarUrl',
      'location',
      'facebookUrl',
      'twitterUrl',
    ];
    const updateFields = Object.keys(updateData);
    try {
      updateFields.forEach((field) => {
        if (profileFields.indexOf(field) < 0) {
          const error = new Error(`user column '${field}' does not exist`);
          error.status = 422;
          throw error;
        }
      });
    } catch (err) {
      return next(err);
    }

    // function to update the user profile
    const updateProfile = async () => {
      try {
        const rowCount = await User.update(updateData, {
          where: { id: { [Op.eq]: userId } }
        });
        if (rowCount > 0) {
          return res.status(200).json({
            status: 'success',
            message: `${rowCount[0]} user profile updated successfully`,
          });
        }
      } catch (error) {
        return next(error);
      }
    };
    updateProfile();
  }

  /**
  * @description - This method logs in user and return a token.
  * @param {object} req - The request object bearing the email and password.
  * @param {object} res - The response object that is returned as json.
  * @returns {object} - The json object with message.
  * @memberOf UserController
  * @static
  */
  static verifyUser(req, res) {
    const { token } = req.query;
    const { id } = verifyToken(token);
    User
      .findByPk(id)
      .then((user) => {
        if (user.confirmEmail) {
          return res.status(403).json({
            errors: {
              message: ['user already verified']
            }
          });
        }
        User
          .update(
            { confirmEmail: true },
            { where: { id } }
          )
          .then(() => res.status(200).json({
            status: 'success',
            message: 'user successfully verified'
          }))
          .catch(err => res.status(500)
            .json({
              errors: {
                message: [err.message]
              }
            }));
      })
      .catch(() => res.status(404)
        .json({
          errors: {
            message: ['user does not exist']
          }
        }));
  }
}

export default UsersController;
