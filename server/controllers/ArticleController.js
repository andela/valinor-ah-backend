import uniqueSlug from 'unique-slug';
import slugify from 'slugify';
import Sequelize from 'sequelize';
import readingTime from 'reading-time';

import models from '../models';
import cleanupArticlesResponse from '../helpers/cleanupArticlesResponse';
import addMetaToArticle from '../helpers/addMetaToArticle';

const {
  Article,
  User,
  ArticleLike,
  Tag,
  ArticleTag,
  Comment,
  ReportHistory,
  Bookmark,
  Category,
  ReportType
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
 * @returns {object} - bookmarks an Article
 */
  static bookmarkArticle(req, res) {
    const userId = req.userData.id;
    const { articleId } = req.params;
    Bookmark.findOrCreate({
      where: {
        userId,
        articleId
      }
    })
      .spread((returnedBookmarkedArticle, status) => {
        if (!status) {
          return Bookmark.destroy({
            where: {
              userId,
              articleId
            }
          })
            .then(() => res.status(200).json({
              status: 'success',
              message: 'Article unbookmarked',
              bookmarkStatus: false
            }));
        }
        if (returnedBookmarkedArticle) {
          return res.status(200).json({
            status: 'success',
            message: 'Article bookmarked',
            bookmarkStatus: true
          });
        }
      });
  }

  /**
 * @description gets bookmarked Article
 * @param {object} req - request object
 * @param {object} res - response object
 * @returns {object} - json response
 */
  static getBookmarkedArticle(req, res) {
    const userId = req.userData.id;
    return Bookmark.findAll({
      where: {
        userId
      },
      include: [{
        model: Article,
        as: 'bookmarkedArticles',
        include: [{
          model: User,
          as: 'author',
          attributes: ['fullName', 'email', 'avatarUrl', 'bio', 'roleId']
        }]
      }
      ],
      order: [['id', 'DESC']]
    }).then((returnedBookmarkedArticle) => {
      if (!returnedBookmarkedArticle.length) {
        return res.status(404).json({
          status: 'failure',
          errors: {
            message: ['you currently have no bookmarked articles']
          }
        });
      }
      if (returnedBookmarkedArticle) {
        const bookmarkedArticles = returnedBookmarkedArticle
          .map(x => x.bookmarkedArticles);
        return res.status(200).json({
          status: 'success',
          message: 'Bookmarked Articles fetched successfully',
          bookmarkedArticles
        });
      }
    });
  }

  /**
 * @description
 * @param {object} req - request object
 * @param {object} res - response object
 * @param {function} next - response object
 * @returns {object} - returns an Article
 */
  static getAnArticle(req, res, next) {
    const { slug } = req.params;
    Article.findOne({
      where: {
        [Op.or]: [{ slug }, { id: +slug || 0 }]
      },
      include: [{
        model: User,
        as: 'author'
      }, {
        model: Comment,
        as: 'comments',
      },
      {
        model: Category,
        as: 'category',
        attributes: ['categoryName']
      }]
    })
      .then(async (result) => {
        if (!result) {
          return res.status(404).json({
            status: 'failure',
            errors: {
              message: ['Article not found']
            }
          });
        }
        const addMeta = await addMetaToArticle([result]);
        const article = cleanupArticlesResponse(addMeta);
        res.status(200).json({
          status: 'success',
          article: article[0]
        });
        return next();
      })
      .catch(err => res.status(500).json({
        status: 'failure',
        errors: {
          message: [err.message]
        }
      }));
  }

  /**
   * controller to fetch all articles
   * @param {object} req - express request object
   * @param {object} res - express response object
   * @param {object} next - express next object
   * @returns {void}
   */
  static async fetchAllCategories(req, res, next) {
    let categories;
    try {
      // find all categories
      categories = await Category.findAll({
        attributes: ['id', 'categoryName'],
        order: [['categoryName', 'ASC']],
      });
    } catch (err) {
      next(err);
    }

    res.status(200).json({
      status: 'success',
      categories,
    });
  }

  /**
   * @description controller to fetch all articles
   * @param {object} req - request object
   * @param {object} res - response object
   * @returns {object} - returns all articles
   */
  static fetchAllArticles(req, res) {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const { meta } = req;
    Article
      .findAndCountAll(meta)
      .then(async (result) => {
        const { rows, count } = result;
        const pageCount = Math.ceil(count / +limit);
        const articlesOnPage = rows.length;
        if (count < 1) {
          return res.status(404).json({
            errors: {
              status: 'failure',
              message: 'no articles found'
            }
          });
        }
        if (+page > pageCount) {
          return res.status(422).json({
            errors: {
              status: 'failure',
              message: 'available number of page(s) exceeded'
            }
          });
        }
        const addMeta = await addMetaToArticle(rows);
        const articles = cleanupArticlesResponse(addMeta);
        return res.status(200).json({
          status: 'success',
          totalPages: pageCount,
          currentPage: +page,
          totalArticles: count,
          articlesOnPage,
          articles
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
      categoryName
    } = req.body;
    const userId = req.userData.id;
    // creata a unique slug
    const slug = `${slugify(title.toLowerCase())}-${uniqueSlug()}`;
    // calculate the reading time
    const stats = readingTime(body);

    let article;
    let user;
    try {
      // find or create  the category
      const [category] = await Category.findOrCreate({
        where: { categoryName },
        defaults: { categoryName: 'others' }
      });
      // create an article
      article = await Article.create({
        title,
        slug,
        description,
        body,
        readTime: stats.time,
        userId,
        categoryId: category.id
      });
      user = await User.findByPk(userId);
    } catch (err) {
      next(err);
    }
    const {
      fullName, email, avatarUrl, bio, roleId
    } = user;
    // article successfully created
    if (article) {
      const articleData = article.dataValues;
      articleData.tags = tags;
      res.status(201).json({
        status: 'success',
        article: {
          ...articleData,
          author: {
            fullName,
            email,
            avatarUrl,
            bio,
            roleId,
          }
        }
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
          articleLikeStatus: true,
          type: suffix
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
            articleLikeStatus: true,
            type: suffix
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
          message: `article ${suffix} reversed successfully`,
          articleLikeStatus: false,
          type: suffix
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

  /**
    * @description - This method adds a new report.
    * @param {object} req - The request object with report body and type.
    * @param {object} res - The response object that is returned as json.
    * @returns {object} - The object with message.
    * @memberOf UserController
    */
  static reportArticle(req, res) {
    const { reportBody, type } = req.body;
    const userId = req.userData.id;
    const { articleId } = req.params;

    Article.findByPk(articleId)
      .then((article) => {
        ReportType.findOne({
          where: {
            title: type
          }
        })
          .then((result) => {
            if (!result) {
              return res.status(404).json({
                status: 'failure',
                message: 'The type you have provided does not exist'
              });
            }

            const typeId = result.id;

            if (article.userId === userId) {
              return res.status(403).json({
                status: 'failure',
                message: 'sorry, you cannot report an article you wrote'
              });
            }
            const authorId = article.userId;

            ReportHistory
              .create({
                reportBody,
                typeId,
                authorId,
                reporterId: userId
              })
              .then(() => {
                res.status(200).json({
                  status: 'success',
                  message: 'your report was successfully submitted'
                });
              })
              .catch(err => res.status(500).json({
                status: 'failure',
                errors: {
                  message: [err.message]
                }
              }));
          })
          .catch(err => res.status(500).json({
            status: 'failure',
            errors: {
              message: [err.message]
            }
          }));
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
