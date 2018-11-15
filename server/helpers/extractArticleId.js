/**
 * @description function to extract return articleIds
 * @param {number} rows
   * @returns {number} article ids
*/
const extractArticleId = (rows) => {
  const result = [];
  for (let x = 0; x < rows.length; x += 1) {
    result.push(rows[x].id);
  }
  return result;
};

export default extractArticleId;
