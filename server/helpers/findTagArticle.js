import models from '../models';

const { ArticleTag } = models;

/**
 * @description function to return articleIds
 * @param {number} tagId
   * @returns {number} article ids
*/
const findTagArticle = async (tagId) => {
  try {
    const result = await ArticleTag.findAll({
      where: {
        tagId
      }
    });
    if (result.length < 1) {
      const error = new Error('this tag does not match any existing article');
      error.status = 404;
      return error;
    }
    const resultArr = [];
    for (let x = 0; x < result.length; x += 1) {
      resultArr.push(result[x].dataValues.articleId);
    }
    return resultArr;
  } catch (error) {
    return error;
  }
};

export default findTagArticle;
