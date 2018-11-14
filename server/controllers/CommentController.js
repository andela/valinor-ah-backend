import Sequelize from 'sequelize';
import models from '../models';

const { User, Comment, CommentLike } = models;

const { Op } = Sequelize;

/**
 * @class CommentController
 * @description Contains Comment related Operations
 */
class CommentController {
  /**
   * @description This method add new comment on an article
     * @param {*} req
     * @param {*} res
     * @returns {object} returns an object of comment
   */
  static addCommentOnArticle(req, res) {
    const { body } = req.body;
    const { articleId } = req.params;
    const userId = req.userData.id;
    return Comment
      .create({
        body,
        userId,
        articleId
      })
      .then((comment) => {
        const {
          createdAt,
          updatedAt
        } = comment;
        User.findByPk(userId)
          .then((user) => {
            const { fullName, avatarUrl } = user;
            res.status(201).json({
              status: 'success',
              message: 'Comment added successfully',
              comment: {
                body: comment.body,
                articleId: comment.articleId,
                createdAt,
                updatedAt,
                commentBy: {
                  userId,
                  fullName,
                  avatarUrl
                },
              }
            });
          });
      })
      .catch(err => res.status(500).json({
        errors: {
          message: [err.message]
        }
      }));
  }

  /**
   * controller to like or dislike an commentId
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {void}
   */
  static async likeOrDislikeComment(req, res, next) {
    const { commentId, action } = req.params;
    const userId = req.userData.id;

    /**
     * This function likes or dislikes an comment
     * @param {boolean} status - true for like, false for dislike
     * @returns {void}
     */
    const likeDisliker = async (status) => {
      let commentLike;
      let created;
      try {
        // find the comment like or create it
        [commentLike, created] = await CommentLike.findOrCreate({
          where: { [Op.and]: [{ userId }, { commentId }] },
          defaults: { status, commentId, userId, }
        });
      } catch (err) {
        return next(err);
      }

      // suffix for message
      const suffix = status ? 'like' : 'dislike';
      // get the article like id
      const commentLikeId = commentLike.dataValues.id;

      if (created) {
        // if like/dislike was added
        return res.status(201).json({
          status: 'success',
          type: suffix,
          commentLikeStatus: true,
          message: `comment successfully ${suffix}d`,
        });
      }

      // if like/dislike was not added
      if (status !== commentLike.dataValues.status) {
        // opposite action was triggered, update the like
        const [rowCount] = await CommentLike.update({
          status: !commentLike.dataValues.status,
        }, {
          where: {
            id: commentLikeId,
          }
        });
        if (rowCount > 0) {
          return res.status(200).json({
            status: 'success',
            type: suffix,
            commentLikeStatus: true,
            message: `you changed your mind, comment successfully ${suffix}d`,
          });
        }
      }
      // same action was triggered, undo the like or dislike
      const undoRows = await CommentLike.destroy({
        where: {
          id: commentLikeId,
        }
      });
      if (undoRows > 0) {
        return res.status(200).json({
          status: 'success',
          type: suffix,
          commentLikeStatus: false,
          message: `comment ${suffix} reversed successfully`,
        });
      }
    };

    // error for unknown action in switch statement
    const unknownActionError = new Error(
      'unknown action, you may either like or dislike only'
    );
    unknownActionError.status = 422;

    // switch statement for like or dislike
    switch (action) {
      case 'like':
        likeDisliker(true);
        break;
      case 'dislike':
        likeDisliker(false);
        break;
      default:
        return next(unknownActionError);
    }
  }
}

export default CommentController;
