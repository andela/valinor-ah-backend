import models from '../models';

const { ArticleLike } = models;

/**
 * @description function to return how many likes or dislikes an article has
 * @param {array} arr
 * @param {boolean} status
   * @returns {number} article likes or dislikes
*/
const getArticleLikesCount = async (arr, status) => {
  const like = [];
  for (let x = 0; x < arr.length; x += 1) {
    const find = ArticleLike.findAll({
      where: {
        articleId: arr[x],
        status
      }
    });
    like.push(find);
  }
  const likes = await Promise.all(like);
  const result = [];
  for (let x = 0; x < likes.length; x += 1) {
    result.push(likes[x].length);
  }
  return result;
};

export default getArticleLikesCount;
