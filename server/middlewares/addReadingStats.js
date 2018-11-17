import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import models from '../models';

dotenv.config();

const { ReadingStats, User } = models;

/**
 *
 * @param {object} req - request object
 * @param {object} res - response object
 * @param {function} next - call next function
 * @returns {void}
 */

// eslint-disable-next-line no-unused-vars
const addReadingStats = (req, res, next) => {
  const { authorization } = req.headers;
  const { slug } = req.params;
  if (authorization) {
    const { id } = jwt.verify(authorization, process.env.JWT_SECRET);
    ReadingStats
      .findOrCreate({
        where: {
          articleId: +slug,
          userId: id
        }
      })
      .spread(async (stats, created) => {
        if (created) {
          // fetch user information
          const userInfo = await User.findByPk(id);
          const { articlesRead } = userInfo.dataValues;
          // update user articlesRead count
          await User.update({
            articlesRead: articlesRead + 1
          }, {
            where: {
              id
            }
          });
        }
      });
  }
};

export default addReadingStats;
