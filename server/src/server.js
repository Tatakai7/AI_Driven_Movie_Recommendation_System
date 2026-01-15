import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from './database.js';
import { authMiddleware } from './middleware/auth.js';
import authRoutes from './routes/authRoutes.js';
import movieRoutes from './routes/movieRoutes.js';
import watchlistRoutes from './routes/watchlistRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Initialize database
await connectDB();

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/auth', authMiddleware, authRoutes);
app.use('/api/movies', authMiddleware, movieRoutes);
app.use('/api/watchlist', authMiddleware, watchlistRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
