/**
 * @description function to extract return ids
 * @param {number} rows
   * @returns {array} ids
*/
const extractId = (rows) => {
  const result = [];
  for (let x = 0; x < rows.length; x += 1) {
    result.push(rows[x].id);
  }
  return result;
};

export default extractId;
