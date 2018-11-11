import models from '../models';

const { Article } = models;

const validateArticleId = async (req, res, next) => {
  const { articleId } = req.params;

  if (Number.isNaN(Number(articleId))) {
    // articleId passed in is not a number
    const nanError = new Error('invalid id, article id must be a number');
    nanError.status = 400;
    return next(nanError);
  }

  let article;
  try {
    article = await Article.findByPk(articleId);
  } catch (err) {
    next(err);
  }

  if (!article) {
    // checks if article exists
    const notFoundError = new Error('Sorry, that article was not found');
    notFoundError.status = 404;
    return next(notFoundError);
  }
  next();
};

export default validateArticleId;
