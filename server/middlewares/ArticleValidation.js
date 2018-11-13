import UserValidation from './UserValidation';

const { sendFormattedError } = UserValidation;

/**
 * @class ValidationHelper
 * @description Helps perform validations on article request body.
 */
class ArticleValidation {
  /**
   * This method validates the title
   * @param {object} req - The request object
   * @returns {void}
   */
  static validateTitle(req) {
    req.checkBody('title', 'please enter a title').exists();
  }

  /**
   * This method validates the description
   * @param {object} req - The request object
   * @returns {void}
   */
  static validateDescription(req) {
    req.checkBody('description', 'please enter a description').exists();
  }

  /**
   * This method validates the title
   * @param {object} req - The request object
   * @returns {void}
   */
  static validateBody(req) {
    req.checkBody('body', 'please enter a body').exists();
  }

  /**
   * Validate the Article input field
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {object} next - The callback function to the next middleware.
   * @return {void}
   */
  static validateArticleInput(req, res, next) {
    ArticleValidation.validateTitle(req);
    ArticleValidation.validateDescription(req);
    ArticleValidation.validateBody(req);
    sendFormattedError(req, res, next);
  }

  /**
   * This method validates the page query
   * @param {object} req - The request object
   * @returns {void}
   */
  static validatePageQuery(req) {
    req.checkQuery(
      'page',
      'page query must be an integer'
    ).optional({ checkFalsy: false }).isInt();
    req.checkQuery(
      'page',
      'page query must be greater than 0'
    ).optional({ checkFalsy: false }).isInt({ gt: 0 });
  }

  /**
   * This method validates the limit query
   * @param {object} req - The request object
   * @returns {void}
   */
  static validateLimitQuery(req) {
    req.checkQuery(
      'limit',
      'limit query must be an integer'
    ).optional({ checkFalsy: false }).isInt();
    req.checkQuery(
      'limit',
      'limit query must be greater than 0'
    ).optional({ checkFalsy: false }).isInt({ gt: 0 });
  }

  /**
   * Validate the Article input field
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {object} next - The callback function to the next middleware.
   * @return {void}
   */
  static validateArticleCommentInput(req, res, next) {
    ArticleValidation.validateBody(req);
    sendFormattedError(req, res, next);
  }

  /**
    * @description - This method validates the article page queries.
    * @param {object} req - The request object to be validated.
    * @param {object} res - Th response object to be validated.
    * @param {object} next - The callback function to the next middleware.
    * @returns {object} - The error object with message.
    * @memberOf ArticleValidators
    * @static
    */
  static validateQuery(req, res, next) {
    ArticleValidation.validatePageQuery(req);
    ArticleValidation.validateLimitQuery(req);
    sendFormattedError(req, res, next, 400);
  }
}

export default ArticleValidation;
