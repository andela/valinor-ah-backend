import express from 'express';

import users from './users';
import articles from './articles';
import comments from './comments';

const router = express.Router();

router.use('/', users, articles, comments);

export default router;
