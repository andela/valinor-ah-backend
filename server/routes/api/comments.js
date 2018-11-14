import express from 'express';
import { verifyToken } from '../../middlewares/tokenUtils';
import CommentController from '../../controllers/CommentController';
import ArticleCommentValidation from
  '../../middlewares/ArticleValidation';
import verifyUser from '../../middlewares/confirmUser';
import validateResourceId from '../../middlewares/validateResourceId';

const comments = express.Router();

const { validateArticleCommentInput } = ArticleCommentValidation;
const {
  addCommentOnArticle,
  likeOrDislikeComment
} = CommentController;

comments.post(
  '/articles/:articleId/comments',
  verifyToken,
  validateArticleCommentInput,
  validateResourceId,
  addCommentOnArticle
);

comments.post(
  '/articles/:articleId/comments/:commentId/reaction/:action',
  verifyToken,
  verifyUser,
  validateResourceId,
  likeOrDislikeComment
);

export default comments;
