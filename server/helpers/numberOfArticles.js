/**
 * @description function to return number of articles on page
 * @param {number} count - total number of articles
 * @param {number} limit - number of articles to be returned per page
 * @param {number} page - current page
 * @returns {number} - returns number of articles on current page
*/
const numberOfArticles = (count, limit, page) => {
  const remainder = count % limit;
  const lastPage = Math.ceil(count / limit);
  if (remainder > 0 && page === lastPage) {
    return remainder;
  } if (page > lastPage) {
    return 0;
  }
  return limit;
};

export default numberOfArticles;
