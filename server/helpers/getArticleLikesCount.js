import models from '../models';

const { ArticleLike } = models;

/**
 * @description function to return how many likes or dislikes an article has
 * @param {array} arr
 * @param {boolean} status
   * @returns {number} article likes or dislikes
*/
const getArticleLikesCount = async (arr, status) => {
  const like = arr.map(articleId => ArticleLike.findAll({
    where: { articleId, status }
  }));
  const likes = await Promise.all(like);
  const result = likes.map(x => x.length);
  return result;
};

export default getArticleLikesCount;
