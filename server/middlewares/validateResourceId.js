import models from '../models';

const { Article, User, Comment } = models;

const validateResourceId = (req, res, next) => {
  const {
    articleId,
    userId,
    commentId,
  } = req.params;

  const validate = async (type, id, model) => {
    if (Number.isNaN(Number(id))) {
      // articleId passed in is not a number
      const nanError = new Error(`invalid id, ${type} id must be a number`);
      nanError.status = 400;
      return next(nanError);
    }

    let resource;
    try {
      resource = await model.findByPk(id);
    } catch (err) {
      return next(err);
    }

    if (!resource) {
      // checks if resource exists
      const notFoundError = new Error(`Sorry, that ${type} was not found`);
      notFoundError.status = 404;
      return next(notFoundError);
    }
  };

  if (articleId) {
    // if article Id param exists
    validate('article', articleId, Article);
  }
  if (userId) {
    // if user Id param exists
    validate('user', userId, User);
  }
  if (commentId) {
    // if comment Id param exists
    validate('comment', commentId, Comment);
  }
  next();
};

export default validateResourceId;
