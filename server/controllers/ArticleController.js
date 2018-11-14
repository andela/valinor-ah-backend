import uniqueSlug from 'unique-slug';
import slugify from 'slugify';
import Sequelize from 'sequelize';
import readingTime from 'reading-time';

import models from '../models';
import numberOfArticles from '../helpers/numberOfArticles';

const {
  Article, User, ArticleLike, Tag, ArticleTag,
} = models;
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
   * @description controller to fetch all articles
   * @param {object} req - request object
   * @param {object} res - response object
   * @returns {object} - returns all articles
   */
  static fetchAllArticles(req, res) {
    const suppliedPage = req.query.page;
    const suppliedLimit = req.query.limit;
    const page = suppliedPage || 1;
    const limit = suppliedLimit || 10;
    const offset = (+page - 1) * +limit;
    Article
      .findAndCountAll({
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
      })
      .then((result) => {
        const { rows, count } = result;
        const pageCount = Math.ceil(count / +limit);
        const articlesOnPage = numberOfArticles(count, +limit, +page);
        if (+page > pageCount) {
          return res.status(422).json({
            errors: {
              status: 'failure',
              message: 'available number of page(s) exceeded'
            }
          });
        }
        return res.status(200).json({
          status: 'success',
          totalPages: pageCount,
          currentPage: +page,
          totalArticles: count,
          articlesOnPage,
          articles: rows
        });
      })
      .catch(err => res.status(500)
        .json({
          errors: {
            message: [err.message]
          }
        }));
  }

  /**
   * controller to create an article
   * @param {object} req - express request object
   * @param {object} res - express response object
   * @param {object} next - express next object
   * @returns {void}
   */
  static async createArticle(req, res, next) {
    const {
      title,
      description,
      body,
      tags,
    } = req.body;
    const userId = req.userData.id;
    // creata a unique slug
    const slug = `${slugify(title.toLowerCase())}-${uniqueSlug()}`;
    // calculate the reading time
    const stats = readingTime(body);

    let article;
    try {
      // create an article
      article = await Article.create({
        title,
        slug,
        description,
        body,
        readTime: stats.time,
        userId,
      });
    } catch (err) {
      next(err);
    }

    // article successfully created
    if (article) {
      const articleData = article.dataValues;
      articleData.tags = tags;
      res.status(201).json({
        status: 'success',
        article: articleData,
      });

      if (tags) {
        // loop through tags and find/create tags and add to articleTags table
        tags.forEach(async (tagName) => {
          let tagData;
          try {
            // find or add entry to tag table
            [tagData] = await Tag.findOrCreate({
              where: { tagName },
              defaults: { tagName }
            });
            // add entry to article tag table
            await ArticleTag.create({
              tagId: tagData.dataValues.id,
              articleId: article.dataValues.id,
            });
          } catch (err) {
            next(err);
          }
        });
      }
    }
  }

  /**
   * controller to like or dislike an article
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {void}
   */
  static async likeOrDislikeArticle(req, res, next) {
    const { articleId, action } = req.params;
    const userId = req.userData.id;

    /**
     * This function likes or dislikes an article
     * @param {boolean} status - true for like, false for dislike
     * @returns {void}
     */
    const likeDisliker = async (status) => {
      let articleLike;
      let created;
      try {
        // find the article like or create it
        [articleLike, created] = await ArticleLike.findOrCreate({
          where: { [Op.and]: [{ userId }, { articleId }] },
          defaults: { status, articleId, userId, }
        });
      } catch (err) {
        return next(err);
      }

      // suffix for message
      const suffix = status ? 'like' : 'dislike';
      // get the article like id
      const articleLikeId = articleLike.dataValues.id;

      if (created) {
        // if like/dislike was added
        return res.status(201).json({
          status: 'success',
          message: `article successfully ${suffix}d`,
        });
      }

      // if like/dislike was not added
      if (status !== articleLike.dataValues.status) {
        // opposite action was triggered, update the like
        const [rowCount] = await ArticleLike.update({
          status: !articleLike.dataValues.status,
        }, {
          where: {
            id: articleLikeId,
          }
        });
        if (rowCount > 0) {
          return res.status(200).json({
            status: 'success',
            message: `you changed your mind, article successfully ${suffix}d`,
          });
        }
      }
      // same action was triggered, undo the like or dislike
      const undoRows = await ArticleLike.destroy({
        where: {
          id: articleLikeId,
        }
      });
      if (undoRows > 0) {
        return res.status(200).json({
          status: 'success',
          message: `article ${suffix}, undo successful`,
        });
      }
    };

    // error for unknown action in switch statement
    // eslint-disable-next-line max-len
    const unknownActionError = new Error('unknown action, you may either like or dislike only');
    unknownActionError.status = 422;

    // switch statement for like or dislike
    switch (action) {
      case 'like':
        likeDisliker(true);
        break;
      case 'dislike':
        likeDisliker(false);
        break;
      default:
        return next(unknownActionError);
    }
  }
}

export default ArticleController;
