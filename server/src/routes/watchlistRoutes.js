import express from 'express';
import {
  addToWatchlist,
  removeFromWatchlist,
  getWatchlist,
  isInWatchlist,
} from '../controllers/watchlistController.js';

const router = express.Router();

router.post('/', addToWatchlist);
router.delete('/:movieId', removeFromWatchlist);
router.get('/', getWatchlist);
router.get('/:movieId', isInWatchlist);

export default router;
