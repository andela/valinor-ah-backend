import models from '../models';
import errorResponse from '../helpers/errorResponse';
import getFollowViews from '../helpers/getfollowViews';

const { User, Article, Follow } = models;

/**
 * @class FollowController
 * @description Follow related Operations
 */
class FollowController {
/**
 * @description
 * @param {object} req - request object
 * @param {object} res - response object
 * @returns {object} - return success response
 */
  static followAuthor(req, res) {
    const { authorId } = req.params;
    const { id } = req.userData;
    const successResponse = (message, followStatus) => res.status(200).json({
      status: 'success',
      message,
      followStatus
    });
    User.findOne({
      where: { id: authorId },
      include: [{
        model: Article,
        as: 'publishedArticles',
      }]
    })
      .then((author) => {
        switch (true) {
          case (!author): {
            return errorResponse('', res, 'user not found', 404);
          }
          case (+author.id === +id): {
            return errorResponse('', res, 'you cant follow yourself', 403);
          }
          case (author.publishedArticles.length < 5): {
            return errorResponse(
              '', res,
              'you cant follow a user with less than 5 published articles',
              403
            );
          }
          case (author.publishedArticles.length >= 5):
            Follow.findOrCreate({
              where: { authorId, followerId: id }
            })
              .spread((followed, status) => {
                if (status) {
                  return successResponse('you followed this author', true);
                }
                Follow.destroy({
                  where: {
                    authorId, followerId: id
                  }
                })
                  .then((unfollowed) => {
                    if (unfollowed) {
                      return successResponse(
                        'you unfollowed this author',
                        false
                      );
                    }
                  })
                  .catch(err => errorResponse(err, res));
              })
              .catch(err => errorResponse(err, res));
            break;
          default:
        }
      })
      .catch(error => errorResponse(error, res));
  }

  /**
 * @description
 * @param {object} req - request object
 * @param {object} res - response object
 * @returns {object} - return success response
 */
  static displayFollowView(req, res) {
    const { userId } = req.params;
    getFollowViews('authorId', userId, 'follower')
      .then((followerView) => {
        getFollowViews('followerId', userId, 'following')
          .then((followingView) => {
            const following = followingView.map(x => x.following);
            const followers = followerView.map(x => x.follower);
            return res.status(200).json({
              status: 'success',
              following,
              followers,
            });
          })
          .catch(err => errorResponse(err, res));
      });
  }
}

export default FollowController;
