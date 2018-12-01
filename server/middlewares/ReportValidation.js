import UserValidation from './UserValidation';

const { sendFormattedError } = UserValidation;

/**
 * @class ValidationHelper
 * @description Helps perform validations on report request body.
 */
class ReportValidation {
  /**
   * This method validates the title
   * @param {object} req - The request object
   * @returns {void}
   */
  static validateTitle(req) {
    req.checkBody('title', 'please enter a title').exists().notEmpty();
  }

  /**
   * This method validates the description
   * @param {object} req - The request object
   * @returns {void}
   */
  static validateDescription(req) {
    req.checkBody('description', 'please enter a description')
      .exists()
      .notEmpty();
  }

  /**
   * Validate the Article input field
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {object} next - The callback function to the next middleware.
   * @return {void}
   */
  static validateReport(req, res, next) {
    ReportValidation.validateTitle(req);
    ReportValidation.validateDescription(req);
    sendFormattedError(req, res, next);
  }
}

export default ReportValidation;
