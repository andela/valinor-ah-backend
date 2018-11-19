import 'babel-polyfill';
import { Op } from 'sequelize';
import cloudinary from 'cloudinary';

import models from '../models';
import sendEmail from '../helpers/sendEmail';
import addMetaToAuthors from '../helpers/addMetaToAuthors';
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
    * @description - This method sends a login link to the user.
    * @param {object} req - The request object bearing the email.
    * @param {object} res - The response object that is returned as json.
    * @returns {object} - The object with message.
    * @memberOf UserController
    * @static
    */
  static signupOrLoginStart(req, res) {
    const lifeSpan = '1h';
    const { fullName, email } = req.body;

    User.findOrCreate({
      where: {
        email
      },
      defaults: {
        fullName,
        email
      }
    })
      .spread((user, created) => {
        const userId = user.id;
        const token = createToken(userId, lifeSpan);

        if (!created) {
          const loginUrl = `${process.env.API_BASE_URL}/users/login?`
            + `token=${token}`;

          // send email with link to login to user
          sendEmail(user, loginLinkMessage(loginUrl, token));

          return res.status(200).json({
            status: 'success',
            message: 'email login link sent successfully',
            token
          });
        }

        sendEmail(user, verifyEmailMessage(token));

        return res.status(201).json({
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

  /**
   * @description - This method gets all authors in the database
   * @param {object} req The express request object
   * @param {object} res The express response object
   * @param {object} next The express next object
   * @returns {void}
   */
  static async fetchAuthors(req, res, next) {
    let result;
    try {
      result = await User
        .findAndCountAll({
          where: { roleId: 2 },
          attributes: [
            'id',
            'fullName',
            'bio',
            'avatarUrl',
            'following',
            'followers',
            'articlesRead',
            'createdAt'
          ],
          order: [['fullName']]
        });
    } catch (error) {
      next(error);
    }
    const { rows, count } = result;
    if (count < 1) {
      const error = new Error(
        'we currently have no authors on Author\'s Haven'
      );
      error.status = 400;
      return next(error);
    }
    const authors = await addMetaToAuthors(rows);
    return res.status(200).json({
      status: 'success',
      authors
    });
  }
}

export default UsersController;
