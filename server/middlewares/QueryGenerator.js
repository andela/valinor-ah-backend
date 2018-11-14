import { Op } from 'sequelize';

import models from '../models';

const { User } = models;
// const { Op } = Sequelize;
/**
 * @description function to return number of articles on page
 * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {void}
*/
const queryGenerator = (req, res, next) => {
  const { search, author, title } = req.query;
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const offset = (+page - 1) * +limit;
  let searchQuery = {};
  const defaultQuery = {
    offset,
    limit,
    include:
          [{
            model: User,
            as: 'author',
            attributes: ['fullName', 'avatarUrl']
          }],
    order: [
      ['id', 'DESC']
    ]
  };
  if (!search && !author && !title) {
    req.meta = defaultQuery;
    return next();
  }

  if (search) {
    searchQuery = {
      [Op.or]: [
        {
          title: {
            $ilike: `%${search}%`,
          }
        }
      ]
    };
  }
  if (author) {
    searchQuery.userId = author;
  }
  if (title) {
    searchQuery.title = {
      $ilike: `%${title}%`
    };
  }
  const customQuery = {
    where: searchQuery,
    offset,
    limit,
    include:
          [{
            model: User,
            as: 'author',
            attributes: ['fullName', 'avatarUrl']
          }],
    order: [
      ['id', 'DESC']
    ]
  };
  req.meta = customQuery;
  return next();
};

export default queryGenerator;
