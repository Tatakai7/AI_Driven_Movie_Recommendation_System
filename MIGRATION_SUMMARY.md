# Migration Complete: Supabase to Node.js + MongoDB + Python ML

## What Changed

Your AI Movie Recommendation System has been successfully migrated from Supabase to a modern, scalable tech stack:

### Before (Supabase)
- Single backend service
- Supabase authentication
- Supabase database
- Basic recommendation logic

### After (Node.js + MongoDB + Python ML)
- **Node.js/Express Backend** - RESTful API for user management, movies, ratings, watchlist
- **MongoDB** - NoSQL database for flexible document storage
- **Python/TensorFlow ML Server** - Advanced ML model for intelligent recommendations
- **React Frontend** - Unchanged UI, now communicates with new APIs

## Key Improvements

1. **Scalability**: Separated services can scale independently
2. **Advanced ML**: TensorFlow-based recommendation engine with:
   - Content-based filtering (genre, ratings, popularity)
   - Collaborative filtering (user similarity)
   - Hybrid approach combining both methods
3. **Flexibility**: MongoDB allows easy schema evolution
4. **Microservices**: Each component is independent and maintainable

## Project Structure

```
├── backend/              ← Node.js Express API
├── ml-backend/          ← Python ML Server
└── src/                 ← React Frontend (unchanged)
```

## Quick Start

### 1. Install MongoDB
- Download from: https://www.mongodb.com/try/download/community
- Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas

### 2. Start All Services

**Terminal 1 - Backend API**
```bash
cd backend
npm install
npm run dev
# Runs on http://localhost:5000
```

**Terminal 2 - ML Backend**
```bash
cd ml-backend
python -m venv venv
# On Windows: venv\Scripts\activate
# On macOS/Linux: source venv/bin/activate
pip install -r requirements.txt
python -m src.app
# Runs on http://localhost:5001
```

**Terminal 3 - Frontend**
```bash
npm install
npm run dev
# Runs on http://localhost:5173
```

## Configuration Files Created

### Backend Files
- `backend/package.json` - Dependencies for Node.js
- `backend/.env.example` - Environment variables template
- `backend/src/server.js` - Express application setup
- `backend/src/database.js` - MongoDB connection
- `backend/src/middleware/auth.js` - JWT authentication
- `backend/src/controllers/` - API request handlers
- `backend/src/routes/` - API route definitions

### ML Backend Files
- `ml-backend/requirements.txt` - Python dependencies
- `ml-backend/.env.example` - Environment variables
- `ml-backend/src/app.py` - Flask server
- `ml-backend/src/model.py` - TensorFlow recommendation model
- `ml-backend/src/config.py` - Configuration

### Frontend Updates
- `src/lib/api.ts` - New API service layer (replaces Supabase)
- `src/contexts/AuthContext.tsx` - Updated for new auth
- `src/views/Browse.tsx` - Updated to use new APIs
- `src/views/Recommendations.tsx` - Updated for new endpoints
- `src/views/Watchlist.tsx` - Updated for new endpoints
- `src/views/Profile.tsx` - Updated for new APIs
- `.env.local` - Frontend configuration

## API Endpoints

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/profile
PUT    /api/auth/profile
```

### Movies
```
GET    /api/movies                           # List all movies
GET    /api/movies/:id                       # Get movie details
POST   /api/movies/rate                      # Rate a movie
GET    /api/movies/:movieId/rating           # Get user rating
GET    /api/movies/recommendations           # Get personalized recommendations
```

### Watchlist
```
GET    /api/watchlist                        # Get user's watchlist
POST   /api/watchlist                        # Add to watchlist
DELETE /api/watchlist/:movieId               # Remove from watchlist
GET    /api/watchlist/:movieId               # Check if in watchlist
```

## Database Schema

All data now stored in MongoDB collections:

- **users** - User accounts with favorite genres
- **movies** - Movie catalog with metadata
- **ratings** - User movie ratings (1-5)
- **watchlist** - User's saved movies to watch

## ML Recommendation Algorithm

The system uses a **hybrid recommendation approach**:

1. **Feature Extraction**
   - Genre match (how many user-preferred genres)
   - Movie quality (average rating)
   - Popularity (number of ratings)
   - Recency (year released)

2. **Scoring**
   - Genre matching: 50% weight
   - Collaborative filtering: 40% weight
   - Popularity bonus: 10% weight

3. **Result**
   - Returns top-N recommendations ranked by composite score
   - Excludes movies already rated by user

## Environment Setup

Create these `.env` files with your configuration:

### `backend/.env`
```
MONGODB_URI=mongodb://localhost:27017/movie-recommendation
PORT=5000
JWT_SECRET=your-secret-key-here
NODE_ENV=development
PYTHON_ML_SERVER=http://localhost:5001
FRONTEND_URL=http://localhost:5173
```

### `ml-backend/.env`
```
MONGODB_URI=mongodb://localhost:27017/movie-recommendation
ML_PORT=5001
NODE_BACKEND_URL=http://localhost:5000
```

### `src/.env.local`
```
VITE_API_URL=http://localhost:5000/api
```

## Features Implemented

✅ User authentication with JWT
✅ User profile management
✅ Favorite genre selection
✅ Movie browsing and searching
✅ Movie rating system
✅ Rating persistence in MongoDB
✅ Watchlist management
✅ ML-powered personalized recommendations
✅ TensorFlow recommendation engine
✅ Hybrid filtering approach
✅ Responsive UI (unchanged)

## Next Steps

1. **Seed Initial Data**: Create a script to add movies to MongoDB
2. **User Testing**: Test the authentication and recommendation flows
3. **Performance Tuning**: Monitor ML model performance
4. **Deployment**: Deploy to production servers
5. **ML Model Enhancement**: Collect user data to improve recommendations

## File Locations

| Purpose | Path |
|---------|------|
| Backend Server | `backend/src/server.js` |
| ML Server | `ml-backend/src/app.py` |
| Frontend | `src/App.tsx` |
| Auth Logic | `src/contexts/AuthContext.tsx` |
| API Client | `src/lib/api.ts` |
| Recommendation Engine | `src/lib/recommendationEngine.ts` |
| Comprehensive Setup Guide | `SETUP.md` |

## Troubleshooting

**Issue**: MongoDB connection error
**Solution**: Ensure MongoDB is running and `MONGODB_URI` is correct in `.env`

**Issue**: CORS errors
**Solution**: Check that `FRONTEND_URL` in backend matches your frontend address

**Issue**: ML backend not responding
**Solution**: Ensure Python venv is activated and TensorFlow is installed

**Issue**: Port already in use
**Solution**: Change the port in respective `.env` files or kill the process using the port

## Support

For detailed setup instructions, see `SETUP.md`
For API documentation, check the individual controller files in `backend/src/controllers/`
For ML model details, see `ml-backend/src/model.py`

---

**Migration Date**: January 15, 2026
**Status**: ✅ Complete and Ready for Testing
