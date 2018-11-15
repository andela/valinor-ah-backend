import express from 'express';
import ArticleController from '../../controllers/ArticleController';
import ArticleValidation from '../../middlewares/ArticleValidation';
import { verifyToken } from '../../middlewares/tokenUtils';
import validateResourceId from '../../middlewares/validateResourceId';

const {
  bookmarkArticle,
  getBookmarkedArticle,
} = ArticleController;
const {
  validateArticleUrl
} = ArticleValidation;

const bookmarks = express.Router();

bookmarks.post(
  '/users/bookmarks/:articleId',
  verifyToken,
  validateArticleUrl,
  validateResourceId,
  bookmarkArticle
);

bookmarks.get(
  '/users/bookmarks',
  verifyToken,
  getBookmarkedArticle
);

export default bookmarks;
