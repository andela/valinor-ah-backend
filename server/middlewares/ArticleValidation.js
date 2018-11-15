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
   * This method validates the title
   * @param {object} req - The request object
   * @returns {void}
   */
  static validateType(req) {
    req.checkBody('type', 'please enter a report type').exists();
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
   * This method validates the description
   * @param {object} req - The request object
   * @returns {void}
   */
  static validateReportBody(req) {
    req.checkBody('reportBody', 'please enter a report body').exists();
  }

  /**
   * This method validates the body
   * @param {object} req - The request object
   * @returns {void}
   */
  static validateBody(req) {
    req.checkBody('body', 'please enter a body').exists();
  }

  /**
   * This method validates the tags
   * @param {object} req - The request object
   * @returns {void}
   */
  static validateTags(req) {
    if (req.body.tags) {
      // custom validation to check if tags are an strings
      req.checkBody('tags', 'tags must be an array of strings')
        .custom((tags) => {
          if (Array.isArray(tags)) {
            let notString = 0;
            tags.forEach((tag) => {
              if ((typeof tag) !== 'string') {
                notString += 1;
              }
            });
            if (!notString) return true;
          }
        });
    }
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
    ArticleValidation.validateTags(req);
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
   * This method validates the tag query
   * @param {object} req - The request object
   * @returns {void}
   */
  static validateTagQuery(req) {
    if (req.query.tag) {
      // custom validation to check if tags are an strings
      req.checkQuery(
        'tag',
        'tag query must be an integer'
      )
        .custom((tag) => {
          const tags = /^(?:\d{1,}\s)*[0-9]{1,}$/.test(tag.trim());
          if (tags) return true;
        });
    }
  }

  /**
   * This method validates the author query
   * @param {object} req - The request object
   * @returns {void}
   */
  static validateAuthorQuery(req) {
    if (req.query.author) {
      req.checkQuery(
        'author',
        'author query must be an integer'
      )
        .custom((author) => {
          const authors = /^(?:\d{1,}\s)*[0-9]{1,}$/.test(author.trim());
          if (authors) return true;
        });
    }
  }

  /**
   * This method validates the category parameter
   * @param {object} req - The request object
   * @returns {void}
   */
  static validateCategoryParams(req) {
    req.checkParams(
      'categoryName',
      'category parameter can only contain alphabets'
    ).optional({ checkFalsy: false }).isAlpha();
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
    ArticleValidation.validateTagQuery(req);
    ArticleValidation.validateAuthorQuery(req);
    ArticleValidation.validateCategoryParams(req);
    sendFormattedError(req, res, next, 400);
  }

  /**
   * @description - Validate the Article input field
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
  static validateReportArticle(req, res, next) {
    ArticleValidation.validateType(req);
    ArticleValidation.validateReportBody(req);
    sendFormattedError(req, res, next, 400);
  }
}

export default ArticleValidation;
