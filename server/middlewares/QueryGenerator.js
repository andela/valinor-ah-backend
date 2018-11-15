import { Op } from 'sequelize';

import models from '../models';
import fetchCategoryId from '../helpers/findCategoryId';
import findTagArticle from '../helpers/findTagArticle';
import getCorrolatingTags from '../helpers/getCorrolatingTags';

const {
  User,
  Category
} = models;

/**
 * @description function to return number of articles on page
 * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {void}
*/
const queryGenerator = async (req, res, next) => {
  const { categoryName } = req.params;
  const {
    search,
    author,
    title,
    tag
  } = req.query;
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const offset = (+page - 1) * +limit;
  let query = {};
  const defaultQuery = {
    offset,
    limit,
    include:
          [{
            model: User,
            as: 'author',
            attributes: ['fullName', 'avatarUrl']
          },
          {
            model: Category,
            as: 'category',
            attributes: ['categoryName']
          }],
    order: [
      ['id', 'DESC']
    ]
  };
  if (!search && !author && !title && !tag && categoryName === 'all') {
    req.meta = defaultQuery;
    return next();
  }
  if (search) {
    query = {
      [Op.or]: [
        {
          title: {
            $ilike: `%${search}%`,
          }
        }
      ]
    };
  }
  if (categoryName !== 'all') {
    const categoryId = await fetchCategoryId(categoryName);
    if (categoryId instanceof Error) next(categoryId);
    query.categoryId = categoryId;
  }
  if (author) query.userId = author;

  if (tag) {
    const articleArr = [];
    const tagArr = tag.split(' ');
    for (let x = 0; x < tagArr.length; x += 1) {
      const articelId = findTagArticle(tagArr[x]);
      articleArr.push(articelId);
    }
    const allArticleId = await Promise.all(articleArr);
    if (allArticleId[0] instanceof Error) next(allArticleId[0]);
    const articleIds = getCorrolatingTags(allArticleId);
    query.id = articleIds;
  }

  const customQuery = {
    where: query,
    ...defaultQuery
  };
  req.meta = customQuery;
  return next();
};

export default queryGenerator;
