import models from '../models';

const { NotificationEvent } = models;

/**
* @description function to return how many likes or dislikes an article has
* @param {receiverId} receiverId - id of user with notification
* @returns {number} article likes or dislikes
*/
const getNotificationCount = async (receiverId) => {
  try {
    const result = await NotificationEvent.count({
      where: {
        receiverId
      }
    });
    return result;
  } catch (err) {
    return err;
  }
};

export default getNotificationCount;
