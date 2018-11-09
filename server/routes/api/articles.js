import express from 'express';
import ArticleController from '../../controllers/ArticleController';

const { getAnArticle } = ArticleController;
const router = express.Router();

router.get('/articles/:slug', getAnArticle);

export default router;
