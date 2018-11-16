import express from 'express';
import ArticleController from '../../controllers/ArticleController';
import { verifyToken } from '../../middlewares/tokenUtils';
import validateResourceId from '../../middlewares/validateResourceId';

const {
  bookmarkArticle,
  getBookmarkedArticle,
} = ArticleController;

const bookmarks = express.Router();

bookmarks.post(
  '/users/bookmarks/:articleId',
  verifyToken,
  validateResourceId,
  bookmarkArticle
);

bookmarks.get(
  '/users/bookmarks',
  verifyToken,
  getBookmarkedArticle
);

export default bookmarks;
