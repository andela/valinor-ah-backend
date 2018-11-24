/**
 * @description function to extract ids
 * @param {number} rows
   * @returns {array} ids
*/
const extractId = (rows) => {
  const result = rows.map(row => row.id);
  return result;
};

export default extractId;
