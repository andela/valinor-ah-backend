import UserValidation from './UserValidation';

const { sendFormattedError } = UserValidation;

/**
 * @class ValidationHelper
 * @description Helps perform validations on article request body.
 */
class ArticleCommentValidation {
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
  static validateArticleCommentInput(req, res, next) {
    ArticleCommentValidation.validateBody(req);
    sendFormattedError(req, res, next);
  }
}

export default ArticleCommentValidation;
