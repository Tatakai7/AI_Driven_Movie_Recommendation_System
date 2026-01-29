import { MongoClient } from 'mongodb';

let db;

export async function connectDB() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/movie-recommendation';
  
  try {
    const client = new MongoClient(mongoUri);
    await client.connect();
    db = client.db();
    
    // Create indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('movies').createIndex({ title: 1 });
    await db.collection('ratings').createIndex({ userId: 1, movieId: 1 });
    await db.collection('watchlist').createIndex({ userId: 1, movieId: 1 });
    
    console.log('Connected to MongoDB');
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export function getDB() {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
}
