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
      status,
      createdAt,
      updatedAt,
      author,
      readTime,
      category,
      likes,
      dislikes,
      comments,
      commentsCount
    } = rows[x].dataValues;
    const {
      fullName,
      avatarUrl,
      roleId,
      bio,
      followers,
      following,
      email
    } = author;
    const newObj = {
      id,
      title,
      slug,
      description,
      body,
      readTime,
      category: category.categoryName,
      rating,
      likes,
      dislikes,
      status,
      commentsCount,
      createdAt,
      updatedAt,
      author: {
        id: author.id,
        fullName,
        avatarUrl,
        roleId,
        email,
        bio,
        followers,
        following
      },
      comments,
    };
    result.push(newObj);
  }
  return result;
};

export default cleanupArticlesResponse;
