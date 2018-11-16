import models from '../models';

const { Category } = models;

/**
 * @description function to return categoryId
 * @param {string} categoryName
   * @returns {number} category id
*/
const fetchCategoryId = async (categoryName) => {
  try {
    const result = await Category.findOne({
      where: {
        categoryName
      }
    });
    if (!result) {
      const error = new Error('this category does not exist');
      error.status = 404;
      return error;
    }
    return result.dataValues.id;
  } catch (error) {
    return error;
  }
};

export default fetchCategoryId;
