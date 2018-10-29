import models from '../models';

const { User } = models;
/**
 * @class ValidationHelper
 * @description Helps perform validations on user request body.
 */
class UserValidation {
  /**
    * @description - This method validates the user request body.
    * @param {object} req - The request object to be validated.
    * @param {object} res - Th response object to be validated.
    * @param {object} next - The callback function to the next middleware.
    * @returns {object} - The error object with message.
    * @memberOf UserValidation
    * @static
    */
  static validateUserSignUp(req, res, next) {
    let { fullName } = req.body;
    const { avatarUrl, bio } = req.body;
    req.checkBody('fullName', 'full name is too long').isLength({ max: 40 });
    req.checkBody('email', 'please enter email').exists();
    req.checkBody('email', 'please enter a valid email').isEmail();
    req.checkBody('password', 'please enter password').exists();
    req.checkBody('password', 'password must be at least 8 characters')
      .isLength({ min: 8 });
    req.checkBody('password', 'password must contain a letter and number')
      .matches(/^((?=.*\d))(?=.*[a-zA-Z])/);
    if (avatarUrl) req.checkBody('avatarUrl', 'avatarUrl is invalid').isURL();
    if (bio) req.checkBody('bio', 'bio is too long').isLength({ max: 200 });
    const errors = req.validationErrors();
    const message = [];
    fullName = fullName === undefined ? '' : fullName;
    const [firstName, ...lastName] = fullName.toString().trim().split(' ');
    if (lastName.join(' ').trim().includes(' ')) {
      message.push('You entered more than two names');
    }
    if (!/^[a-zA-Z-]+$/.test(firstName)
    || !/^[a-zA-Z-]+$/.test(lastName.join(''))) {
      message.push('Invalid full name');
      message.push('please enter first name and last name separated by space');
    }
    if (!errors && !message.length) {
      req.body.fullName = `${firstName} ${lastName.join('')}`;
      return next();
    }
    if (errors) errors.forEach(err => message.push(err.msg));
    return res.status(422).json({
      errors: {
        message
      }
    });
  }

  /**
    * @description - This method checks if an email is already in the system.
    * @param {object} req - The request object bearing the email.
    * @param {object} res - The response object sent to the next middleware.
    * @param {object} next - The callback function to the next middleware.
    * @returns {object} - The error object with message.
    * @memberOf UserValidation
    * @static
    */
  static checkExistingEmail(req, res, next) {
    const { email } = req.body;
    return User.findOne({
      where: {
        email
      }
    })
      .then((foundEmail) => {
        if (foundEmail) {
          return res.status(409).json({
            errors: {
              message: ['email is already in use']
            }
          });
        }
        if (!foundEmail) return next();
      })
      .catch(err => res.status(500).json({
        errors: {
          message: ['error reading user table', `${err}`]
        }
      }));
  }

  /**
    * @description - This method checks if a user enters an email and password.
    * @param {object} req - The request object bearing the email.
    * @param {object} res - The response object sent to the next middleware.
    * @param {object} next - The callback function to the next middleware.
    * @returns {object} - The error object with message.
    * @memberOf UserValidation
    * @static
    */
  static validateUserLogin(req, res, next) {
    const { email, password } = req.body;
    const errors = {};
    const returnError = () => res.status(422).json({
      errors
    });
    if (email && password) return next();
    if (!email && !password) {
      errors.email = ['please enter email'];
      errors.password = ['please enter password'];
    }
    if (!email) errors.email = ['please enter email'];
    if (!password) errors.password = ['please enter password'];
    return returnError();
  }
}
export default UserValidation;
