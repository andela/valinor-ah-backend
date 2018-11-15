/**
 * @description function to return arry of articleId with matching tagId's
 * @param {array} arr
   * @returns {array} array of articleId's
*/
const getCorrolatingTags = (arr) => {
  const allLength = arr.length;
  if (arr.length < 2) {
    if (arr[0].length < 2) return arr[0][0];
    return arr[0];
  }
  const combinedArrays = [];
  for (let x = 0; x < arr.length; x += 1) {
    combinedArrays.push(...arr[x]);
  }
  const all = combinedArrays.sort((a, b) => a - b);

  const uniques = all.filter((one, index) => one !== all[index + 1]);

  const result = [];
  for (let x = 0; x < uniques.length; x += 1) {
    let count = 0;
    for (let y = 0; y < all.length; y += 1) {
      if (uniques[x] === all[y]) {
        count += 1;
      }
    }
    if (count === allLength) {
      result.push(uniques[x]);
    }
  }
  return result;
};

export default getCorrolatingTags;
