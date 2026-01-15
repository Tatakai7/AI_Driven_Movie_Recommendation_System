import { getDB } from '../database.js';
import { ObjectId } from 'mongodb';

export async function addToWatchlist(req, res) {
  try {
    const { movieId } = req.body;
    const db = getDB();

    if (!movieId) {
      return res.status(400).json({ error: 'Movie ID is required' });
    }

    const result = await db.collection('watchlist').updateOne(
      { userId: new ObjectId(req.userId), movieId: new ObjectId(movieId) },
      {
        $set: {
          addedAt: new Date(),
        },
      },
      { upsert: true }
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Add to watchlist error:', error);
    res.status(500).json({ error: 'Failed to add to watchlist' });
  }
}

export async function removeFromWatchlist(req, res) {
  try {
    const { movieId } = req.params;
    const db = getDB();

    await db.collection('watchlist').deleteOne({
      userId: new ObjectId(req.userId),
      movieId: new ObjectId(movieId),
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Remove from watchlist error:', error);
    res.status(500).json({ error: 'Failed to remove from watchlist' });
  }
}

export async function getWatchlist(req, res) {
  try {
    const db = getDB();

    const watchlist = await db
      .collection('watchlist')
      .aggregate([
        { $match: { userId: new ObjectId(req.userId) } },
        {
          $lookup: {
            from: 'movies',
            localField: 'movieId',
            foreignField: '_id',
            as: 'movie',
          },
        },
        { $unwind: '$movie' },
        { $sort: { addedAt: -1 } },
      ])
      .toArray();

    const movies = watchlist.map(item => item.movie);
    res.json({ movies });
  } catch (error) {
    console.error('Get watchlist error:', error);
    res.status(500).json({ error: 'Failed to fetch watchlist' });
  }
}

export async function isInWatchlist(req, res) {
  try {
    const { movieId } = req.params;
    const db = getDB();

    const item = await db.collection('watchlist').findOne({
      userId: new ObjectId(req.userId),
      movieId: new ObjectId(movieId),
    });

    res.json({ inWatchlist: !!item });
  } catch (error) {
    console.error('Check watchlist error:', error);
    res.status(500).json({ error: 'Failed to check watchlist' });
  }
}
