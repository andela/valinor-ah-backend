import express from 'express';
import { verifyToken } from '../../middlewares/tokenUtils';
import CommentController from '../../controllers/CommentController';
import ArticleCommentValidation from
  '../../middlewares/ArticleValidation';
import validateArticleId from '../../middlewares/validateArticleId';

const comments = express.Router();

const { validateArticleCommentInput } = ArticleCommentValidation;
const {
  addCommentOnArticle
} = CommentController;

comments.post(
  '/articles/:articleId/comments',
  verifyToken,
  validateArticleCommentInput,
  validateArticleId,
  addCommentOnArticle
);

export default comments;
