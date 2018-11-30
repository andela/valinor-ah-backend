import dotenv from 'dotenv';
import models from '../models';
import errorResponse from '../helpers/errorResponse';
import getFollowViews from '../helpers/getfollowViews';
import NotificationController from './NotificationController';
import sendEmail from '../helpers/sendEmail';

const { addNewNotificationEvent } = NotificationController;
let type;

dotenv.config();

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
                  // TODO 1: notify the author with authorId via email that
                  //         follower with followerId follows him/her
                  sendEmail(
                    author,
                    {
                      subject: 'New Follower',
                      body: `You have new follower. 
                      Check it out at ${process.env.API_BASE_URL}/users/${id}`
                    }
                  );
                  // TODO 2: Also add a new entry to notification events
                  type = 'Follow';
                  addNewNotificationEvent(
                    'follows',
                    authorId,
                    id,
                    'You have a new follower/unfollower',
                    `${process.env.API_BASE_URL}/users/${id}`,
                    false,
                    author,
                    type
                  );
                  return successResponse('you followed this author', true);
                }
                Follow.destroy({
                  where: {
                    authorId, followerId: id
                  }
                })
                  .then((unfollowed) => {
                    if (unfollowed) {
                      // TODO 3: notify the author with authorId that
                      // follower with followerId unfollows him/her
                      sendEmail(
                        author,
                        {
                          subject: 'Follower unfollow',
                          body: `A follower unfollows you. 
                            Check it out at 
                            ${process.env.API_BASE_URL}/users/${id}`
                        }
                      );
                      // TODO 4: Also add a new entry to notification events
                      type = 'Unfollow';
                      addNewNotificationEvent(
                        'unfollows',
                        authorId,
                        id,
                        'Someone unfollowed you',
                        `${process.env.API_BASE_URL}/users/${id}`,
                        false,
                        author,
                        type
                      );
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
