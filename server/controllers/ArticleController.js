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
      include: [User]
    })
      .then((returnedArticle) => {
        if (!returnedArticle) {
          return res.status(404).json({
            status: 'failure',
            errors: {
              message: ['Article not found']
            }
          });
        }
        const {
          id,
          title,
          description,
          body,
          createdAt,
          updatedAt,
          userId
        } = returnedArticle;
        const {
          fullName,
          email,
          avatarUrl,
          bio,
          roleId
        } = returnedArticle.User;
        return res.status(200).json({
          status: 'success',
          article: {
            id,
            title,
            slug: returnedArticle.slug,
            description,
            body,
            createdAt,
            updatedAt,
            userId,
            author: {
              fullName,
              email,
              avatarUrl,
              bio,
              roleId
            }
          }
        });
      })
      .catch(err => res.status(500).json({
        status: 'failure',
        errors: {
          message: [err.message]
        }
      }));
  }
}

export default ArticleController;
