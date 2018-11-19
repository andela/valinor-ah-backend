import getArticleLikesCount from './getArticleLikesCount';
import extractId from './extractId';
import getCommentsCount from './getCommentsCount';

/**
 * @description function to add likes,
 * dislikes and comment count to array of objects
 * @param {array} rows
   * @returns {object} rows
*/
const addMetaToArticle = async (rows) => {
  // get ids of all returned articles
  const articleIds = extractId(rows);

  // get how many likes each article has
  const likesArr = await getArticleLikesCount(articleIds, true);
  // insert likes into rows
  for (let x = 0; x < rows.length; x += 1) {
    rows[x].dataValues.likes = likesArr[x];
  }

  // get how many dislikes each article has
  const dislikesArr = await getArticleLikesCount(articleIds, false);
  // insert dislikes into rows
  for (let x = 0; x < rows.length; x += 1) {
    rows[x].dataValues.dislikes = dislikesArr[x];
  }

  // get how many comments an article has
  const commentCount = await getCommentsCount(articleIds);
  // insert comments count into rows
  for (let x = 0; x < rows.length; x += 1) {
    rows[x].dataValues.commentsCount = commentCount[x];
  }
  return rows;
};

export default addMetaToArticle;
