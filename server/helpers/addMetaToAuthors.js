import extractId from './extractId';
import models from '../models';

const { Article } = models;

/**
 * @description function to add articlesWritten to author object
 * @param {array} rows
   * @returns {array} rows
*/
const addMetaToAuthors = async (rows) => {
  // get ids of all returned authors
  const authorIds = extractId(rows);
  const allArticles = authorIds.map(userId => Article
    .findAndCountAll({
      where: { userId }
    }));
  const result = await Promise.all(allArticles);
  for (let x = 0; x < result.length; x += 1) {
    const { count } = result[x];
    rows[x].dataValues.articlesWritten = count;
  }
  return rows;
};

export default addMetaToAuthors;
