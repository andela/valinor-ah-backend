import models from '../models';

const { Comment } = models;

/**
 * @description function to return how many comments an article has
 * @param {array} arr
 * @param {boolean} status
   * @returns {number} comment count
*/
const getCommentsCount = async (arr) => {
  const comments = [];
  for (let x = 0; x < arr.length; x += 1) {
    const comment = Comment.findAll({
      where: {
        articleId: arr[x]
      }
    });
    comments.push(comment);
  }
  const countArr = await Promise.all(comments);
  const result = [];
  for (let x = 0; x < countArr.length; x += 1) {
    result.push(countArr[x].length);
  }
  return result;
};

export default getCommentsCount;
