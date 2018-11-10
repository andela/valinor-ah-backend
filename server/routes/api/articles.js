import express from 'express';

import ArticleController from '../../controllers/ArticleController';

const router = express.Router();

const { fetchAllArticles, getAnArticle } = ArticleController;

router.get('/articles/:slug', getAnArticle);

router.get('/articles', fetchAllArticles);

export default router;
