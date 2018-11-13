import express from 'express';

import users from './users';
import articles from './articles';
import comments from './comments';
import ratings from './ratings';

const router = express.Router();

router.use('/', users, articles, ratings, comments);

export default router;
