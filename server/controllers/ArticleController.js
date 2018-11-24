import uniqueSlug from 'unique-slug';
import slugify from 'slugify';
import Sequelize from 'sequelize';
import readingTime from 'reading-time';
import models from '../models';
import cleanupArticlesResponse from '../helpers/cleanupArticlesResponse';
import addMetaToArticle from '../helpers/addMetaToArticle';
import addTagsToArticle from '../helpers/addTagsToArticle';
import { deleteArticle, updateStatus } from '../helpers/deleteUtils';
import errorResponse from '../helpers/errorResponse';

const {
  Article,
  User,
  ArticleLike,
  ArticleTag,
  Comment,
  ReportHistory,
  Bookmark,
  Category,
  ReportType,
  CommentReply
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
    const {
      slug
    } = req.params;
    const defaultQuery = {
      where: {
        [Op.or]: [{ slug }, { id: +slug || 0 }],
        status: 'publish',
      },
      include: [{
        model: User,
        as: 'author'
      }, {
        model: Comment,
        as: 'comments',
        include: [{
          model: CommentReply,
          as: 'replies',
          attributes: [
            'id',
            'body',
            'createdAt',
            'updatedAt'
          ],
          include: [{
            model: User,
            as: 'commenter',
            attributes: [
              'id',
              'fullName',
              'avatarUrl',
              'bio',
              'location',
              'following',
              'followers',
              'createdAt'
            ]
          }]
        }]
      },
      {
        model: Category,
        as: 'category',
        attributes: ['categoryName']
      }],
      order: [
        [
          { model: Comment, as: 'comments' },
          { model: CommentReply, as: 'replies' },
          'id', 'DESC'
        ],
      ],
    };
    Article.findOne(defaultQuery)
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
    } = req.body;

    let { categoryName, status } = req.body;
    // if no category provided, default to others
    if (!categoryName) categoryName = 'others';
    // if no status is provided, default to draft
    if (!status) status = 'draft';


    const userId = req.userData.id;
    // creata a unique slug
    const slug = `${slugify(title.toLowerCase())}-${uniqueSlug()}`;
    // calculate the reading time
    const stats = readingTime(body);

    let article, user;
    try {
      // find or create the category
      const [category] = await Category.findOrCreate({
        where: { categoryName },
        defaults: { categoryName }
      });

      // create an article
      article = await Article.create({
        title,
        slug,
        description,
        body,
        readTime: stats.time,
        status,
        userId,
        categoryId: category.id
      });

      // get user
      user = await User.findByPk(userId);

      if (tags) {
        // add tags to the article
        const err = await addTagsToArticle(tags, article.id);
        if (err) {
          throw err;
        }
      }
    } catch (err) {
      return next(err);
    }
    // get user details
    const {
      fullName, email, avatarUrl, bio, roleId
    } = user;

    if (article) {
      // article successfully created
      const articleData = article.dataValues;
      articleData.tags = tags;
      return res.status(201).json({
        status: 'success',
        message: 'article successfully created',
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
    }
  }

  /**
   * controller to edit an article
   * @param {object} req - express request object
   * @param {object} res - express response object
   * @param {object} next - express next object
   * @returns {void}
   */
  static async editArticle(req, res, next) {
    const updateData = req.body;
    const { articleId } = req.params;

    // function to update the article
    const updateArticle = async () => {
      let article, articleData, rowCount, user;
      try {
        // update the article
        [rowCount, article] = await Article.update(updateData, {
          where: { id: articleId },
          returning: true,
        });
        if (updateData.tags) {
          // delete the tags
          await ArticleTag.destroy({ where: { articleId } });
          // add new tags
          const err = addTagsToArticle(updateData.tags, article.id);
          if (err) {
            throw err;
          }
        }
        // get user
        user = await User.findByPk(req.userData.id);
        // get user details
        const {
          fullName, email, avatarUrl, bio, roleId
        } = user;

        // add tags and author info to article data
        articleData = article[0].dataValues;
        articleData.tags = updateData.tags;
        articleData.author = {
          fullName, email, avatarUrl, bio, roleId
        };
      } catch (error) {
        return next(error);
      }
      if (rowCount > 0) {
        return res.status(200).json({
          status: 'success',
          message: `${rowCount} article updated successfully`,
          article: articleData,
        });
      }
    };
    updateArticle();
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

  /**
    * @description - This method deletes an article.
    * @param {object} req - The request object.
    * @param {object} res - The response object that is returned as json.
    * @returns {object} - The object with message.
    * @memberOf UserController
    */
  static async deleteUserArticle(req, res) {
    try {
      if (req.isOwner) {
        if (req.articleData.status === 'trash') {
          await deleteArticle(req.articleData.id)(res);
        } else {
          await updateStatus('trash', req.articleData.id)(res);
        }
      }
      if (req.isAdmin) await deleteArticle(req.articleData.id)(res);
    } catch (err) {
      return err;
    }
  }

  /**
    * @description - This method fetches all articles for a user.
    * @param {object} req - The request object.
    * @param {object} res - The response object that is returned as json.
    * @returns {object} - The object with message.
    * @memberOf UserController
    */
  static async fetchUserArticles(req, res) {
    const userId = req.userData.id;
    let articles;
    try {
      articles = await Article.findAll({
        where: {
          userId
        },
        include: [{
          model: User,
          as: 'author',
          attributes: [
            'fullName',
            'email',
            'avatarUrl',
            'bio',
            'roleId',
            'followers',
            'following',
          ]
        }]
      });
    } catch (err) {
      return errorResponse(err, res);
    }

    if (articles.length) {
      return res.status(200).json({
        status: 'success',
        articles
      });
    }
    return errorResponse('', res, 'No articles found', 404);
  }
}

export default ArticleController;
