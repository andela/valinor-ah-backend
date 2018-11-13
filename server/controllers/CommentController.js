import models from '../models';

const { User, Comment } = models;
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
}
export default CommentController;
