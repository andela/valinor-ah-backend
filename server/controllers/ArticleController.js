import Sequelize from 'sequelize';

import models from '../models';

const { Article, User } = models;
const { Op } = Sequelize;
/**
 * @class ArticleController
 * @description Article related Operations
 */
class ArticleController {
/**
 * @description
 * @param {object} req - request object
 * @param {object} res - response object
 * @returns {object} - returns an Article
 */
  static getAnArticle(req, res) {
    const { slug } = req.params;
    Article.findOne({
      where: {
        [Op.or]: [{ slug }, { id: +slug || 0 }]
      },
      include: [{
        model: User,
        as: 'author',
        attributes: ['fullName', 'email', 'avatarUrl', 'bio', 'roleId']
      }]
    })
      .then((article) => {
        if (!article) {
          return res.status(404).json({
            status: 'failure',
            errors: {
              message: ['Article not found']
            }
          });
        }
        return res.status(200).json({
          status: 'success',
          article
        });
      })
      .catch(err => res.status(500).json({
        status: 'failure',
        errors: {
          message: [err.message]
        }
      }));
  }

  /**
   * controller to create an article
   * @param {object} req
   * @param {object} res
   * @returns {void}
   */
  static fetchAllArticles(req, res) {
    Article
      .findAndCountAll({
        include:
          [{
            model: User,
            as: 'author',
            attributes: ['fullName', 'avatarUrl']
          }],
        order: [
          ['id', 'DESC']
        ]
      })
      .then((result) => {
        res.status(200).json({
          status: 'success',
          articles: result.rows
        });
      })
      .catch(err => res.status(500)
        .json({
          errors: {
            message: [err.message]
          }
        }));
  }
}

export default ArticleController;
