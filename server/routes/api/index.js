import express from 'express';

import users from './users';
import articles from './articles';

const router = express.Router();

router.use('/', users, articles);

export default router;
