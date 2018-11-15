/**
 * @description function to return well formatted articles
 * @param {array} rows
   * @returns {object} returns articles object
*/
const cleanupArticlesResponse = (rows) => {
  const result = [];
  for (let x = 0; x < rows.length; x += 1) {
    const {
      id,
      title,
      slug,
      description,
      body,
      rating,
      createdAt,
      updatedAt,
      author,
      category,
      likes,
      dislikes,
      comments
    } = rows[x].dataValues;
    const newObj = {
      id,
      title,
      slug,
      description,
      body,
      category: category.categoryName,
      author: author.fullName,
      authorAvatar: author.avatarUrl,
      rating,
      likes,
      dislikes,
      comments,
      createdAt,
      updatedAt,
    };
    result.push(newObj);
  }
  return result;
};

export default cleanupArticlesResponse;
