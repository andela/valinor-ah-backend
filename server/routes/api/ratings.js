import express from 'express';
import RatingsController from '../../controllers/RatingsController';
import { verifyToken } from '../../middlewares/tokenUtils';
import RatingValidation from '../../middlewares/RatingValidation';

const { addRating } = RatingsController;
const router = express.Router();

const { validateRatingInput } = RatingValidation;

router.post('/articles/:articleId/rating/',
  verifyToken,
  validateRatingInput,
  addRating);

export default router;
