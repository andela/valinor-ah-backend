import express from 'express';

import { verifyToken } from '../../middlewares/tokenUtils';
import ArticleController from '../../controllers/ArticleController';
import ArticleValidation from '../../middlewares/ArticleValidation';
import validateResourceId from '../../middlewares/validateResourceId';
import queryGenerator from '../../middlewares/QueryGenerator';
import addReadingStats from '../../middlewares/addReadingStats';
import TagController from '../../controllers/TagController';
import validateAccess from '../../middlewares/validateAccess';

const articles = express.Router();
const { getAllArticleTags } = TagController;
const {
  validateReportArticle,
  validateArticleInput,
  validateArticleUpdate,
  validateQuery
} = ArticleValidation;
const {
  createArticle,
  editArticle,
  getAnArticle,
  fetchAllCategories,
  fetchAllArticles,
  likeOrDislikeArticle,
  reportArticle,
} = ArticleController;

// get all categories
articles.get(
  '/articles/categories',
  fetchAllCategories
);

// get all tags
articles.get('/articles/tags', getAllArticleTags);

// post an article
articles.post(
  '/articles',
  verifyToken,
  validateArticleInput,
  createArticle
);

// update an article
articles.patch(
  '/articles/:articleId',
  verifyToken,
  validateResourceId,
  validateArticleUpdate,
  validateAccess(['USER', 'AUTHOR']),
  editArticle
);

articles.get(
  '/articles/:slug',
  getAnArticle,
  addReadingStats
);

// get all articles, search articles, filter articles
articles.get(
  '/articles/category/:categoryName',
  validateQuery,
  queryGenerator,
  fetchAllArticles
);

// like or dislike articles
articles.post(
  '/articles/:articleId/reaction/:action',
  verifyToken,
  validateResourceId,
  likeOrDislikeArticle
);

// route to report articles
articles.post('/articles/:articleId/reports',
  validateResourceId, verifyToken, validateReportArticle, reportArticle);

export default articles;
