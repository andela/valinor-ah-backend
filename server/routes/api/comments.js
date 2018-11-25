import express from 'express';
import { verifyToken } from '../../middlewares/tokenUtils';
import CommentController from '../../controllers/CommentController';
import ArticleCommentValidation from
  '../../middlewares/ArticleValidation';
import verifyUser from '../../middlewares/confirmUser';
import validateResourceId from '../../middlewares/validateResourceId';

const comments = express.Router();

const {
  validateArticleCommentInput,
  validateCommentReplyInput
} = ArticleCommentValidation;
const {
  addCommentOnArticle,
  editComment,
  getComment,
  likeOrDislikeComment,
  addCommentToComment
} = CommentController;

// post a comment
comments.post(
  '/articles/:articleId/comments',
  verifyToken,
  validateArticleCommentInput,
  validateResourceId,
  addCommentOnArticle
);

// post a comment on a comment
comments.post(
  '/articles/comments/:commentId',
  verifyToken,
  validateCommentReplyInput,
  validateResourceId,
  addCommentToComment
);

// like or dislike a comment
comments.post(
  '/articles/:articleId/comments/:commentId/reaction/:action',
  verifyToken,
  verifyUser,
  validateResourceId,
  likeOrDislikeComment
);

// edit a comment
comments.patch('/comments/:commentId',
  verifyToken, validateResourceId, editComment);

// get a comment and its entire history
comments.get('/comments/:commentId',
  verifyToken, validateResourceId, getComment);

export default comments;
