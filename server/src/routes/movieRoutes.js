import express from 'express';
import {
  getMovies,
  getMovieById,
  rateMovie,
  getUserRating,
  getRecommendations,
} from '../controllers/movieController.js';

const router = express.Router();

router.get('/', getMovies);
router.get('/:id', getMovieById);
router.post('/rate', rateMovie);
router.get('/:movieId/rating', getUserRating);
router.get('/recommendations', getRecommendations);

export default router;
