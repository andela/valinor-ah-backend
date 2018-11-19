import 'babel-polyfill';
import { Op } from 'sequelize';
import cloudinary from 'cloudinary';

import models from '../models';
import sendEmail from '../helpers/sendEmail';
import {
  verifyEmailMessage,
  loginLinkMessage
} from '../helpers/emailTemplates';
import { createToken } from '../middlewares/tokenUtils';
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
    const { fullName, email } = req.body;
    const lifeSpan = '1h';
    return User
      .create({
        fullName,
        email
      })
      .then((user) => {
        const token = createToken(user.id, lifeSpan);
        sendEmail(
          user,
          verifyEmailMessage(token)
        );

        res.status(201).json({
          status: 'success',
          message: 'New account created successfully. Please check your '
          + 'inbox and verify your email address.'
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
  * @description - This method sends a login link to the user.
  * @param {object} req - The request object bearing the email.
  * @param {object} res - The response object that is returned as json.
  * @returns {object} - The object with message.
  * @memberOf UserController
  * @static
  */
  static userLoginStart(req, res) {
    const { email } = req.body;
    const lifeSpan = '1h';

    return User.findOne({
      where: {
        email
      }
    })
      .then((userFound) => {
        if (!userFound) {
          return res.status(404).json({
            errors: {
              message: ['User not found']
            }
          });
        }

        const userId = userFound.id;
        const token = createToken(userId, lifeSpan);
        const loginUrl = `${process.env.API_BASE_URL}/users/login?`
      + `token=${token}`;

        // send email with link to login to user
        sendEmail(userFound, loginLinkMessage(loginUrl, token));

        res.status(200).json({
          status: 'success',
          message: 'email login link sent successfully',
          token
        });
      })
      .catch(err => res.status(500).json({
        errors: {
          message: [err.message]
        }
      }));
  }

  /**
    * @description - This method logs in user and return a token.
    * @param {object} req - The request object with token as a query object.
    * @param {object} res - The response object that is returned as json.
    * @returns {object} - The object with message.
    * @memberOf UserController
    * @static
    */
  static userLoginEnd(req, res) {
    const { id } = req.userData;
    const lifeSpan = '90d';

    User.findByPk(id)
      .then((userFound) => {
        if (!userFound) {
          return res.status(404).json({
            errors: {
              message: ['User not found']
            }
          });
        }

        const token = createToken(id, lifeSpan);

        // Require the user to have a confirmed email before they can log on.
        if (!userFound.confirmEmail) {
          const tokenAge = Math.abs(Date.now() - userFound.createdAt) / 3600000;

          if (tokenAge < 1) {
            return res.status(409).json({
              status: 'failure',
              message: 'Please check your email and verify your email address'
            });
          }
          // Resend email confirmation link
          sendEmail(userFound, verifyEmailMessage(token));

          return res.status(409).json({
            status: 'failure',
            message: 'You must have a confirmed email to log on.'
          });
        }

        const {
          email,
          fullName,
          roleId
        } = userFound;

        return res.status(200).json({
          status: 'success',
          message: 'you are logged in',
          user: {
            id,
            fullName,
            email,
            roleId,
            token
          }
        });
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
  static updateProfile(req, res, next) {
    // check if request token id matches id of account to be updated
    const { userId } = req.params;
    const { id } = req.userData;
    if (id !== parseInt(userId, 10)) {
      const error = new Error('can\'t update another user\'s profile');
      error.status = 403;
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
  * @param {object} req - The request object bearing the email.
  * @param {object} res - The response object that is returned as json.
  * @returns {object} - The json object with message.
  * @memberOf UserController
  * @static
  */
  static verifyUser(req, res) {
    const { id } = req.userData;
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

        const lifeSpan = '90d';
        const token = createToken(user.id, lifeSpan);

        User
          .update(
            { confirmEmail: true },
            { where: { id } }
          )
          .then(verifiedUser => res.status(200).json({
            status: 'success',
            message: 'Email confirmed successfully',
            user: {
              id: verifiedUser.id,
              fullName: verifiedUser.fullName,
              roleId: verifiedUser.roleId,
              email: verifiedUser.email,
              confirmEmail: verifiedUser.confirmEmail,
              createdAt: verifiedUser.createdAt,
              updatedAt: verifiedUser.updatedAt,
              token
            }
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

  /**
   * @description - This method gets a list of user profiles
   * @param {object} req The express request object
   * @param {object} res The express response object
   * @param {object} next The express next object
   * @returns {void}
   */
  static getUserProfiles(req, res, next) {
    // get all user profiles and order by full name
    User.findAll({
      attributes: [
        'fullName',
        'avatarUrl',
        'bio',
        'twitterUrl',
        'facebookUrl',
        'location',
        'roleId',
      ],
      order: [
        ['fullName', 'ASC']
      ],
      raw: true,
    })
      .then((result) => {
        res.status(200).json({
          Users: result,
        });
      })
      .catch((err) => {
        next(err);
      });
  }

  /**
   * @description - This method gets a single user profile
   * @param {object} req The express request object
   * @param {object} res The express response object
   * @param {object} next The express next object
   * @returns {void}
   */
  static async getSingleProfile(req, res, next) {
    // requester id
    const requesterId = req.userData.id;
    // profile id
    const { userId } = req.params;

    let userProfile;
    try {
      // get the single user by id
      userProfile = await User.findByPk(userId, {
        raw: true,
      });
    } catch (err) {
      next(err);
    }

    // delete unneeded information
    delete userProfile.facebookId;
    delete userProfile.twitterId;
    delete userProfile.googleId;

    // check if the requester is not the owner of the user profile
    if (requesterId !== +userId) {
      // delete sensitive information
      delete userProfile.email;
      delete userProfile.updatedAt;
    }

    return res.status(200).json({
      status: 'success',
      userProfile,
    });
  }
}

export default UsersController;
