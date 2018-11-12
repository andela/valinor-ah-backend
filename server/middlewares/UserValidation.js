import checkEmail from '../helpers/checkEmail';

const message = [];
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
    UserValidation.validateFullName(req);
    UserValidation.validateEmail(req);
    UserValidation.validatePassword(req);
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
    * @description - This method validates the password
    * @param {object} req - The request object
    * @returns {null} - returns nothing
    * @memberOf UserValidation
    * @static
    */
  static validatePassword(req) {
    req.checkBody('password', 'please enter password').exists();
    req.checkBody('password', 'password must be at least 8 characters')
      .isLength({ min: 8 });
    req.checkBody('password', 'password must contain a letter and number')
      .matches(/^((?=.*\d))(?=.*[a-zA-Z])/);
    req.checkBody('password', 'password must not contain space')
      .matches(/^\S*$/);
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
    * @description - This method sends the error in the suggested json format.
    * @param {object} req - The request object to be validated.
    * @param {object} res - Th response object.
    * @param {object} next - The callback function to the next middleware.
    * @returns {object} - The error object with message.
    * @memberOf UserValidation
    * @static
    */
  static sendFormattedError(req, res, next) {
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
    if (newErrors || message.length) return res.status(422).json({ errors });
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
