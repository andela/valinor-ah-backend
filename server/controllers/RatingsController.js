import models from '../models';

const { Rating } = models;

/**
 * @class RatingsController
 * @description  Rating related route handlers
 */
class RatingsController {
/**
 * @description
 * @param {object} req - request object
 * @param {object} res - request object
 * @returns {object} - returns rating
 */
  static addRating(req, res) {
    const { rating } = req.body;
    const { articleId } = req.params;
    const userId = req.userData.id;

    Rating.findOrCreate({
      where: {
        articleId,
        userId
      },
      defaults: {
        rating
      }
    })
      .spread((newRating, created) => {
        if (!created) {
          return newRating
            .update({ rating })
            .then(() => res.status(200).json({
              status: 'success',
              message: 'rating updated sucessfully'
            }))
            .catch(err => res.status(500)
              .json({
                errors: {
                  message: [err.message]
                }
              }));
        }
        return res.status(201).json({
          status: 'success',
          message: 'rating added sucessfully'
        });
      })
      .catch((err) => {
        res.status(500).json({
          errors: {
            message: [err.message]
          },
        });
      });
  }
}

export default RatingsController;
