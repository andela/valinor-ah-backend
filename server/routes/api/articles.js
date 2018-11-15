import express from 'express';

import { verifyToken } from '../../middlewares/tokenUtils';
import ArticleController from '../../controllers/ArticleController';
import ArticleValidation from '../../middlewares/ArticleValidation';
import validateResourceId from '../../middlewares/validateResourceId';
import queryGenerator from '../../middlewares/QueryGenerator';
import addReadingStats from '../../middlewares/addReadingStats';

const articles = express.Router();

const {
  validateReportArticle,
  validateArticleInput,
  validateQuery
} = ArticleValidation;
const {
  createArticle,
  getAnArticle,
  fetchAllArticles,
  likeOrDislikeArticle,
  reportArticle
} = ArticleController;

// post an article
articles.post(
  '/articles',
  verifyToken,
  validateArticleInput,
  createArticle
);
articles.post(
  '/articles',
  verifyToken,
  validateArticleInput,
  createArticle
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

// routes to report articles
articles.post('/articles/:articleId/report',
  verifyToken, validateReportArticle, reportArticle);

export default articles;
