import models from '../models';
import extractId from './extractId';

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
  const commentCount = await Promise.all(comments);
  const replies = commentCount.map(comment => extractId(comment));
  const commentReplies = replies.map(commentId => CommentReply.findAll({
    where: { commentId }
  }));
  const replyCount = await Promise.all(commentReplies);
  const commentCountArray = commentCount.map(x => x.length);
  const replyCountArray = replyCount.map(x => x.length);
  const result = commentCountArray
    .map((x, index) => x + replyCountArray[index]);
  return result;
};

export default getCommentsCount;
