import express from 'express';
import { verifyToken } from '../../middlewares/tokenUtils';
import CommentController from '../../controllers/CommentController';
import ArticleCommentValidation from
  '../../middlewares/ArticleValidation';
import verifyUser from '../../middlewares/confirmUser';
import validateResourceId from '../../middlewares/validateResourceId';
import validateAccess from '../../middlewares/validateAccess';

const comments = express.Router();

const {
  validateArticleCommentInput
} = ArticleCommentValidation;
const {
  addCommentOnArticle,
  editComment,
  getComment,
  likeOrDislikeComment,
  deleteComment,
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
  validateArticleCommentInput,
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

// delete a user comment
comments.delete(
  '/comments/:commentId',
  verifyToken,
  validateResourceId,
  validateAccess(['ADMIN', 'USER', 'AUTHOR']),
  deleteComment
);

export default comments;
