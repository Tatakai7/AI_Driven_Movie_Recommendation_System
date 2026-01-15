import { getDB } from '../database.js';
import { ObjectId } from 'mongodb';
import axios from 'axios';

export async function getMovies(req, res) {
  try {
    const { genre, search, limit = 20, skip = 0 } = req.query;
    const db = getDB();

    const filter = {};
    if (genre) {
      filter.genres = { $in: [genre] };
    }
    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    const movies = await db
      .collection('movies')
      .find(filter)
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .toArray();

    const total = await db.collection('movies').countDocuments(filter);

    res.json({
      movies,
      total,
      limit: parseInt(limit),
      skip: parseInt(skip),
    });
  } catch (error) {
    console.error('Get movies error:', error);
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
}

export async function getMovieById(req, res) {
  try {
    const { id } = req.params;
    const db = getDB();

    const movie = await db.collection('movies').findOne({
      _id: new ObjectId(id),
    });

    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.json(movie);
  } catch (error) {
    console.error('Get movie error:', error);
    res.status(500).json({ error: 'Failed to fetch movie' });
  }
}

export async function rateMovie(req, res) {
  try {
    const { movieId, rating } = req.body;
    const db = getDB();

    if (!movieId || rating === undefined || rating < 0 || rating > 5) {
      return res.status(400).json({ error: 'Invalid movie ID or rating' });
    }

    const result = await db.collection('ratings').updateOne(
      { userId: new ObjectId(req.userId), movieId: new ObjectId(movieId) },
      {
        $set: {
          rating,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    // Update movie average rating
    const allRatings = await db
      .collection('ratings')
      .find({ movieId: new ObjectId(movieId) })
      .toArray();

    const avgRating =
      allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;

    await db.collection('movies').updateOne(
      { _id: new ObjectId(movieId) },
      {
        $set: {
          averageRating: avgRating,
          ratingCount: allRatings.length,
        },
      }
    );

    res.json({ success: true, rating });
  } catch (error) {
    console.error('Rate movie error:', error);
    res.status(500).json({ error: 'Failed to rate movie' });
  }
}

export async function getUserRating(req, res) {
  try {
    const { movieId } = req.params;
    const db = getDB();

    const rating = await db.collection('ratings').findOne({
      userId: new ObjectId(req.userId),
      movieId: new ObjectId(movieId),
    });

    res.json(rating || { rating: null });
  } catch (error) {
    console.error('Get user rating error:', error);
    res.status(500).json({ error: 'Failed to fetch rating' });
  }
}

export async function getRecommendations(req, res) {
  try {
    const { limit = 10 } = req.query;
    const db = getDB();
    const pythonServer = process.env.PYTHON_ML_SERVER || 'http://localhost:5001';

    // Get user ratings and preferences
    const userRatings = await db
      .collection('ratings')
      .find({ userId: new ObjectId(req.userId) })
      .toArray();

    const user = await db.collection('users').findOne({
      _id: new ObjectId(req.userId),
    });

    // Call Python ML backend
    const response = await axios.post(`${pythonServer}/recommendations`, {
      userId: req.userId,
      userRatings: userRatings.map(r => ({
        movieId: r.movieId.toString(),
        rating: r.rating,
      })),
      favoriteGenres: user.favoriteGenres,
      limit: parseInt(limit),
    });

    const recommendedMovieIds = response.data.recommendations.map(
      r => new ObjectId(r.movieId)
    );

    const movies = await db
      .collection('movies')
      .find({ _id: { $in: recommendedMovieIds } })
      .toArray();

    res.json({ movies });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
}
