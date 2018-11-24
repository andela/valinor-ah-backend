import models from '../models';

const { Comment, CommentReply } = models;

/**
 * @description function to return how many comments an article has
 * @param {array} arr
 * @param {boolean} status
   * @returns {number} comment count
*/
const getCommentsCount = async (arr) => {
  const comments = arr.map(articleId => Comment.findAll({
    where: { articleId }
  }));
  const commentReplies = arr.map(articleId => CommentReply.findAll({
    where: { articleId }
  }));
  const commentCount = await Promise.all(comments);
  const replyCount = await Promise.all(commentReplies);
  const commentCountArray = commentCount.map(x => x.length);
  const replyCountArray = replyCount.map(x => x.length);
  const result = commentCountArray.map(
    (x, index) => x + replyCountArray[index]
  );
  return result;
};

export default getCommentsCount;
