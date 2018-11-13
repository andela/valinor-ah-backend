import UserValidation from './UserValidation';

const { sendFormattedError } = UserValidation;

/**
 * @class ValidationHelper
 * @description Helps perform validations on article request body.
 */
class RatingValidation {
  /**
   * This method validates the title
   * @param {object} req - The request object
   * @returns {void}
   */
  static validateRating(req) {
    req.checkBody('rating', 'please enter a rating').exists();
    req.checkBody('rating', 'rating must be a number').isNumeric();
  }

  /**
   * Validate the Article input field
   * @param {object} req - The request object
   * @param {object} res - The response object
   * @param {object} next - The callback function to the next middleware.
   * @return {void}
   */
  static validateRatingInput(req, res, next) {
    RatingValidation.validateRating(req);
    sendFormattedError(req, res, next);
  }
}

export default RatingValidation;
