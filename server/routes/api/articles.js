import express from 'express';

import { verifyToken } from '../../middlewares/tokenUtils';
import ArticleController from '../../controllers/ArticleController';
import ArticleValidation from '../../middlewares/ArticleValidation';
import validateArticleId from '../../middlewares/validateArticleId';

const articles = express.Router();

const {
  validateArticleInput,
  validateQuery
} = ArticleValidation;
const {
  createArticle,
  getAnArticle,
  fetchAllArticles,
  likeOrDislikeArticle,
} = ArticleController;

articles.post('/articles', verifyToken, validateArticleInput, createArticle);

articles.get('/articles/:slug', getAnArticle);
articles.get('/articles', fetchAllArticles);

articles.get('/articles', validateQuery, fetchAllArticles);


// routes to like or dislike articles
articles.post(
  '/articles/:articleId/:action',
  verifyToken, validateArticleId, likeOrDislikeArticle
);

export default articles;
