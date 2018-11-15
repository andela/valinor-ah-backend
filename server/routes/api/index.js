import express from 'express';

import users from './users';
import articles from './articles';
import comments from './comments';
import ratings from './ratings';
import bookmarks from './bookmarks';
import reports from './reports';
import notifications from './notifications';

const router = express.Router();

router.use(
  '/',
  bookmarks,
  users,
  articles,
  comments,
  ratings,
  reports,
  notifications
);

export default router;
