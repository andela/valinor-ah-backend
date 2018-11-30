/* eslint-disable max-len */
import models from '../models';
import sendEmail from '../helpers/sendEmail';
import {
  follow,
  unfollow,
  like,
  comment
} from '../helpers/emailTemplates';

const { NotificationEvent, User } = models;

/**
 * @class NOtificationController
 * @description Contains notification related operations
 */
class NotificationController {
  /**
   * @description Adds new entry to notification entry
   * @param {string} notification - notification type
   * @param {integer} receiverId - the id of the user who
   *  is receiving the notification
   * @param {integer} senderId - the id of the user who
   *  triggers the notification
   * @param {string} body - the body of the notification
   * @param {string} url -
   * @param {boolean} status - status of the notification (read or unread)
   * @param {user} user - author of the article
   * @param {type} type - the type of notification
   * @returns {object} - returns object of the entry
   */
  static addNewNotificationEvent(notification, receiverId, senderId, body, url, status, user, type) {
    let notificationId;
    switch (notification) {
      case 'follows':
        notificationId = 1;
        break;
      case 'article reaction':
        notificationId = 2;
        break;
      default:
    }
    NotificationEvent.create({
      notificationId,
      receiverId,
      senderId,
      body,
      url,
      status
    })
      .then(event => event)
      .catch(err => err);

    // TODO 3: notify the author with authorId that
    // follower with followerId unfollows him/her
    let messageObject;

    switch (type) {
      case 'Follow':
        messageObject = follow(senderId, type);
        break;
      case 'Unfollow':
        messageObject = unfollow(senderId, type);
        break;
      case 'Like':
        messageObject = like(url, type);
        break;
      case 'Comment':
        messageObject = comment(url, type);
        break;
      default:
    }

    sendEmail(
      user,
      messageObject
    );
  }

  /**
   * @description Deletes an entry in NotificationEvent
   * @param {integer} receiverId - the id of the user who is
   *  receiving the notification
   * @param {integer} senderId - the id of the user who
   *  triggers the notification
   * @returns {null} - returns nothing
   */
  static deleteNotificationEventEntry(receiverId, senderId) {
    NotificationEvent.destroy({
      where: {
        receiverId,
        senderId
      }
    })
      .then(event => event)
      .catch(err => err.message);
  }

  /**
   * @description allow a user to opt in or out of notification
   * @param {object} req - request object
   * @param {object} res - response object
   * @return {void} -
   */
  static updateNotificationStatus(req, res) {
    const { notification } = req.body;
    const { id } = req.userData;
    let status;
    User.update({ notification }, { where: { id } })
      .then(() => {
        // set status to either opt-in or opt-out
        switch (notification) {
          case false:
            status = 'opt-out';
            break;
          default:
            status = 'opt-in';
        }
        res.status(200).json({
          status: 'success',
          message: `You have successfully ${status}`,
        });
      })
      .catch(err => res.status(500)
        .json({
          errors: {
            message: [err.message]
          }
        }));
  }

  /**
   * @description allow a user to opt in or out of notification
   * @param {object} req - request object
   * @param {object} res - response object
   * @return {void} -
   */
  static getUserNotifications(req, res) {
    const { id } = req.userData;

    NotificationEvent.findAll({ where: { receiverId: id } })
      .then((notifications) => {
        res.status(200).json({
          status: 'success',
          message: 'Notifications retrieved successfully',
          notifications
        });
      })
      .catch();
  }
}

export default NotificationController;
