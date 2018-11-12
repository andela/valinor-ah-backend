import express from 'express';

import { verifyToken } from '../../middlewares/tokenUtils';
import ArticleController from '../../controllers/ArticleController';
import ArticleValidation from '../../middlewares/ArticleValidation';

const articles = express.Router();

const { validateArticleInput } = ArticleValidation;
const {
  createArticle,
  getAnArticle,
  fetchAllArticles,
} = ArticleController;

articles.post('/articles', verifyToken, validateArticleInput, createArticle);

articles.get('/articles/:slug', getAnArticle);

articles.get('/articles', fetchAllArticles);

export default articles;
