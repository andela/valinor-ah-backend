import express from 'express';

import users from './users';
import articles from './articles';
import comments from './comments';
import ratings from './ratings';
import bookmarks from './bookmarks';

const router = express.Router();

router.use('/', bookmarks, users, articles, comments, ratings);

export default router;
