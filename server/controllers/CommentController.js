import dotenv from 'dotenv';
import Sequelize from 'sequelize';
import models from '../models';
import NotificationController from './NotificationController';
import sendEmail from '../helpers/sendEmail';

dotenv.config();
const { Op } = Sequelize;

const {
  User, Comment, CommentEvent, CommentLike, CommentReply, ArticleLike
} = models;

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
    const { body, inlineComment } = req.body;
    const { articleId } = req.params;
    const userId = req.userData.id;
    return Comment
      .create({
        body,
        inlineComment,
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
            ArticleLike.findAll({
              where: {
                articleId,
                status: true
              },
              include: [{ model: User }]
            })
              .then((users) => {
                // looping through the list of users who liked the article
                users.map((userObj) => {
                  sendEmail(userObj.User, {
                    subject: 'New Article Reaction',
                    body: `You have new article reaction. 
                    Check it out at 
                    ${process.env.API_BASE_URL}/article/${articleId}`
                  });
                  const type = 'Comment';

                  // add a new entry to notification events
                  NotificationController.addNewNotificationEvent(
                    'article reaction',
                    userObj.User.id,
                    user.id,
                    'You have a new reaction on an article you liked',
                    `${process.env.API_BASE_URL}/article/${articleId}`,
                    false,
                    user,
                    type
                  );
                  return userObj;
                });
              });

            res.status(201).json({
              status: 'success',
              message: 'Comment added successfully',
              comment: {
                id: comment.id,
                body: comment.body,
                inlineComment: comment.inlineComment,
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
   * @description This method add new comment on a comment
     * @param {object} req
     * @param {object} res
     * @param {object} next
     * @returns {object} returns an object of comment
   */
  static async addCommentToComment(req, res) {
    const { id } = req.userData;
    const { commentId } = req.params;
    const { body } = req.body;
    let reply;
    let commenter;
    try {
      reply = await CommentReply.create({
        body,
        commentId,
        userId: id
      });
      commenter = await User.findOne({
        where: { id },
        attributes: [
          'id',
          'fullName',
          'avatarUrl',
          'bio',
          'following',
          'followers',
          'roleId',
          'createdAt'
        ]
      });
    } catch (error) {
      return error;
    }
    reply.dataValues.commenter = commenter;
    return res.status(201).json({
      status: 'success',
      message: 'reply successfully added',
      reply,
    });
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

  /**
   * @description This method edits a comment on an article
     * @param {object} req - exporess request object
     * @param {object} res - express response object
     * @param {object} next - express next object
     * @returns {object} returns an object of comment
   */
  static async editComment(req, res, next) {
    const { update } = req.body;
    const { commentId } = req.params;
    let rowCount;
    let comment;
    try {
      comment = await Comment.findByPk(commentId, {
        raw: true,
      });
      if (comment.body === update) {
        // if no changes were made
        const noChangeError = new Error('you must make changes to update');
        noChangeError.status = 409;
        return next(noChangeError);
      }
      [rowCount] = await Comment.update(
        { body: update },
        { where: { id: commentId } }
      );
    } catch (err) {
      return next(err);
    }

    if (rowCount > 0) {
      return res.status(200).json({
        status: 'success',
        message: `${rowCount} comment successfully updated`,
      });
    }
  }

  /**
   * @description This method add new comment on an article
     * @param {object} req - exporess request object
     * @param {object} res - express response object
     * @param {object} next - express next object
     * @returns {object} returns an object of comment
   */
  static async getComment(req, res, next) {
    const { commentId } = req.params;
    const comment = {};

    let current;
    let history;
    try {
      // get the comment
      current = await Comment.findByPk(commentId, {
        include: [{
          model: User,
          as: 'author',
          attributes: ['fullName', 'avatarUrl', 'roleId'],
        }],
      });

      // get comment history
      history = await CommentEvent.findAll({
        where: {
          commentId
        },
        attributes: ['previousBody', 'createdAt'],
      });
    } catch (err) {
      return next(err);
    }

    comment.current = current;
    comment.history = history;
    return res.status(200).json({
      status: 'success',
      comment,
    });
  }

  /**
  * @description This method deletes a comment on an article
  * @param {object} req - exporess request object
  * @param {object} res - express response object
  * @param {object} next - express next object
  * @returns {object} returns an object of comment
  */
  static async deleteComment(req, res, next) {
    const { commentId } = req.params;
    let rowCount;

    try {
      rowCount = await Comment.destroy({
        where: { id: commentId }
      });
    } catch (err) {
      return next(err);
    }

    if (rowCount > 0) {
      return res.status(200).json({
        status: 'success',
        message: 'Comment has been deleted'
      });
    }
  }
}

export default CommentController;
