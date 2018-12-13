import checkEmail from '../helpers/checkEmail';

const message = [];
/**
 * @class ValidationHelper
 * @description Helps perform validations on user request body.
 */
class UserValidation {
  /**
    * @description - This method checks if a user enters an email.
    * @param {object} req - The request object bearing the email.
    * @param {object} res - The response object sent to the next middleware.
    * @param {object} next - The callback function to the next middleware.
    * @returns {object} - The error object with message.
    * @memberOf UserValidation
    * @static
    */
  static validateUserLogin(req, res, next) {
    UserValidation.validateEmail(req);
    UserValidation.sendFormattedError(req, res, next);
  }

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
    UserValidation.validateFullName(req);
    UserValidation.validateEmail(req);
    UserValidation.sendFormattedError(req, res, next);
  }

  /**
    * @description - This method validates the user update body.
    * @param {object} req - The request object to be validated.
    * @param {object} res - Th response object to be validated.
    * @param {object} next - The callback function to the next middleware.
    * @returns {object} - The error object with message.
    * @memberOf UserValidation
    * @static
    */
  static validateUserUpdate(req, res, next) {
    if (req.body.fullName) {
      UserValidation.validateFullName(req);
    }
    if (req.body.email) {
      UserValidation.validateEmail(req);
    }
    if (req.body.bio) {
      UserValidation.validateBio(req);
    }
    if (req.body.avatarUrl) {
      UserValidation.validateUrl(req, 'avatarUrl');
    }
    if (req.body.facebookUrl) {
      UserValidation.validateUrl(req, 'facebookUrl');
    }
    if (req.body.twitterUrl) {
      UserValidation.validateUrl(req, 'twitterUrl');
    }
    if (req.body.location) {
      UserValidation.validateLocation(req);
    }
    UserValidation.sendFormattedError(req, res, next);
  }

  /**
    * @description - This method validates notification Setting.
    * @param {object} req - The request object to be validated.
    * @param {object} res - Th response object to be validated.
    * @param {object} next - The callback function to the next middleware.
    * @returns {object} - The error object with message.
    * @memberOf UserValidation
    * @static
    */
  static validateNotificationSetting(req, res, next) {
    UserValidation.validateNotificationStatus(req);
    UserValidation.sendFormattedError(req, res, next);
  }

  /**
    * @description - This method validates the avatarUrl
    * @param {object} req - The request object
    * @param {object} fieldName - The url field name
    * @returns {null} - returns nothing
    * @memberOf UserValidation
    * @static
    */
  static validateUrl(req, fieldName) {
    req.checkBody(fieldName, `invalid ${fieldName}`).isURL();
  }

  /**
    * @description - This method validates the params in url
    * @param {object} req - The request object
    * @param {object} fieldName - The url param
    * @returns {null} - returns nothing
    * @memberOf UserValidation
    * @static
    */
  static validateUrlParams(req, fieldName) {
    req.checkParams(fieldName, `invalid ${fieldName} in url`)
      .isNumeric();
  }

  /**
    * @description - This method validates the params in url
    * @param {object} req - The request object
    * @param {object} res - The request object
    * @param {function} next - callback to the next middleware
    * @param {object} fieldName - The url param
    * @returns {null} - returns nothing
    * @memberOf UserValidation
    * @static
    */
  static validateFollowUserUrl(req, res, next) {
    if (req.params.authorId) UserValidation.validateUrlParams(req, 'authorId');
    if (req.params.userId) UserValidation.validateUrlParams(req, 'userId');
    UserValidation.sendFormattedError(req, res, next);
  }

  /**
    * @description - This method validates the bio
    * @param {object} req - The request object
    * @returns {null} - returns nothing
    * @memberOf UserValidation
    * @static
    */
  static validateBio(req) {
    req.checkBody('bio', 'bio must not exceed 200 characters')
      .isLength({ max: 200 });
  }

  /**
    * @description - This method validates the location
    * @param {object} req - The request object
    * @returns {null} - returns nothing
    * @memberOf UserValidation
    * @static
    */
  static validateLocation(req) {
    req.checkBody('location', 'location may only contain letters').isAlpha();
  }

  /**
    * @description - This method validates the email
    * @param {object} req - The request object
    * @returns {null} - returns nothing
    * @memberOf UserValidation
    * @static
    */
  static validateEmail(req) {
    req.checkBody('email', 'please enter email').exists();
    req.checkBody('email', 'please enter a valid email').isEmail();
  }

  /**
    * @description - This method validates notification status
    * @param {object} req - The request object
    * @returns {null} - returns nothing
    * @memberOf UserValidation
    * @static
    */
  static validateNotificationStatus(req) {
    req.checkBody('notification', 'please enter notification status').exists();
    req.checkBody(
      'notification',
      'Sorry, notification status is either true or false'
    ).isBoolean();
  }

  /**
    * @description - This method validates the fullName
    * @param {object} req - The request object
    * @returns {null} - returns nothing
    * @memberOf UserValidation
    * @static
    */
  static validateFullName(req) {
    message.length = 0;
    let { fullName } = req.body;
    req.checkBody('fullName', 'full name is too long').isLength({ max: 40 });
    fullName = fullName === undefined ? '' : fullName;
    const [firstName, ...lastName] = fullName.toString().trim().split(' ');
    if (lastName.join(' ').trim().includes(' ')) {
      message.push('You entered more than two names');
    }
    if (!/^[a-zA-Z-]+$/.test(firstName)
    || !/^[a-zA-Z-]+$/.test(lastName.join(''))) {
      message.push('Invalid full name');
      message
        .push('please enter first name and last name separated by space');
    }
    req.body.fullName = `${firstName} ${lastName.join('')}`;
  }

  /**
    * @description - This method validates social type
    * @param {object} req - The request object
    * @returns {null} - returns nothing
    * @memberOf UserValidation
    * @static
    */
  static validateSocialType(req) {
    req.checkBody(
      'socialType',
      'Please provide a social type e.g facebook'
    ).exists();
    req.checkBody(
      'socialType',
      'socialType cannot be empty'
    ).notEmpty();
    req.checkBody(
      'socialType',
      'social type must be facebook, twitter or google'
    ).custom((socialType) => {
      if (
        socialType === 'twitter'
        || socialType === 'facebook'
        || socialType === 'google'
      ) return true;
    });
  }

  /**
    * @description - This method validates social id
    * @param {object} req - The request object
    * @returns {null} - returns nothing
    * @memberOf UserValidation
    * @static
    */
  static validateSocialId(req) {
    req.checkBody(
      'socialId',
      'Please provide a socialId e.g 730184790124'
    ).exists();
    req.checkBody(
      'socialId',
      'SocialId cannot be empty'
    ).notEmpty();
  }

  /**
  * @description - This method validates the socialLogin
  * @param {object} req - The request object
  * @param {object} res - Th response object.
  * @param {object} next - The callback function to the next middleware.
  * @returns {null} - returns nothing
  * @memberOf UserValidation
  * @static
  */
  static validateSocialSignup(req, res, next) {
    UserValidation.validateFullName(req);
    UserValidation.validateEmail(req);
    UserValidation.validateUrl(req, 'avatarUrl');
    UserValidation.validateSocialType(req);
    UserValidation.validateSocialId(req);
    UserValidation.sendFormattedError(req, res, next, 400);
  }

  /**
    * @description - This method sends the error in the suggested json format.
    * @param {object} req - The request object to be validated.
    * @param {object} res - Th response object.
    * @param {object} next - The callback function to the next middleware.
    * @param {number} statusCode - the status code for the error
    * @returns {object} - The error object with message.
    * @memberOf UserValidation
    * @static
    */
  static sendFormattedError(req, res, next, statusCode) {
    const newErrors = req.validationErrors();
    const errors = {};
    if (message.length) {
      errors.fullName = [];
      errors.fullName.push(...message);
    }
    if (newErrors) {
      newErrors.forEach((x) => {
        errors[`${x.param}`] = [];
      });
      newErrors.forEach((err) => {
        if (errors[`${err.param}`]) { errors[`${err.param}`].push(err.msg); }
      });
    }
    if (newErrors || message.length) {
      return res.status(statusCode || 422).json({ errors });
    }
    if (!newErrors && !message.length) return next();
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
    checkEmail(email)
      .then((emailFound) => {
        if (!emailFound) return next();
        if (emailFound) {
          return res.status(409).json({
            errors: {
              email: ['email is already in use']
            }
          });
        }
      })
      .catch(err => res.status(500).json({
        error: {
          message: ['error reading user table', `${err}`]
        }
      }));
  }
}

export default UserValidation;
