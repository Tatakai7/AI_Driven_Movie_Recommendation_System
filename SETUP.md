# AI Driven Movie Recommendation System

A modern AI-powered movie recommendation system built with Node.js, MongoDB, Python ML backend, and React frontend.

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS + Vite
- **Backend**: Node.js + Express + MongoDB
- **ML Backend**: Python + TensorFlow + Flask + scikit-learn
- **Authentication**: JWT
- **Recommendation Engine**: Hybrid approach (content-based + collaborative filtering)

## Features

- ✅ User authentication and profiles
- ✅ Personalized movie recommendations based on ML model
- ✅ Favorite genre selection
- ✅ Movie rating system
- ✅ Watchlist management
- ✅ Browse and search movies by genre or keyword
- ✅ TensorFlow-powered recommendation engine
- ✅ Responsive UI design

## Project Structure

```
AI_Driven_Movie_Recommendation_System/
├── backend/                    # Node.js Express API
│   ├── src/
│   │   ├── controllers/       # Request handlers
│   │   ├── routes/            # API routes
│   │   ├── middleware/        # Auth & error handling
│   │   ├── database.js        # MongoDB connection
│   │   └── server.js          # Express app setup
│   ├── package.json
│   └── .env.example
│
├── ml-backend/                 # Python ML Server
│   ├── src/
│   │   ├── app.py             # Flask app
│   │   ├── model.py           # Recommendation model
│   │   └── config.py          # Configuration
│   ├── requirements.txt
│   └── .env.example
│
├── src/                        # React Frontend
│   ├── components/            # Reusable components
│   ├── views/                 # Page components
│   ├── contexts/              # React context (Auth)
│   ├── lib/                   # Utilities & API service
│   ├── App.tsx
│   └── main.tsx
│
├── package.json
├── vite.config.ts
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- Python 3.8+
- MongoDB (local or cloud instance)
- npm or yarn

### 1. MongoDB Setup

**Option A: Local MongoDB**
```bash
# On Windows, install MongoDB Community Edition from:
# https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/

# Start MongoDB service
net start MongoDB
```

**Option B: MongoDB Atlas (Cloud)**
- Create account at https://www.mongodb.com/cloud/atlas
- Create a cluster and get connection string
- Update `MONGODB_URI` in backend `.env`

### 2. Backend Setup

```bash
cd backend

# Copy environment file
copy .env.example .env

# Update .env with your settings
# MONGODB_URI=mongodb://localhost:27017/movie-recommendation
# JWT_SECRET=your-secret-key-here
# PYTHON_ML_SERVER=http://localhost:5001

# Install dependencies
npm install

# Start the server
npm run dev
# Server runs on http://localhost:5000
```

### 3. ML Backend Setup

```bash
cd ml-backend

# Copy environment file
copy .env.example .env

# Create Python virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the Flask server
python -m src.app
# Server runs on http://localhost:5001
```

### 4. Frontend Setup

```bash
# Copy environment file (if not exists)
copy .env.example .env.local

# Update .env.local if needed
# VITE_API_URL=http://localhost:5000/api

# Install dependencies
npm install

# Start development server
npm run dev
# Frontend runs on http://localhost:5173
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Movies
- `GET /api/movies` - Get all movies (supports filtering by genre, search)
- `GET /api/movies/:id` - Get movie details
- `POST /api/movies/rate` - Rate a movie
- `GET /api/movies/:movieId/rating` - Get user's rating for a movie
- `GET /api/movies/recommendations` - Get personalized recommendations

### Watchlist
- `GET /api/watchlist` - Get user's watchlist
- `POST /api/watchlist` - Add movie to watchlist
- `DELETE /api/watchlist/:movieId` - Remove movie from watchlist
- `GET /api/watchlist/:movieId` - Check if movie is in watchlist

## ML Recommendation Model

The recommendation system uses a hybrid approach:

1. **Content-Based Filtering**: Matches movies based on:
   - Genre preferences
   - User's favorite genres
   - Movie quality (rating, popularity, year)

2. **Collaborative Filtering**: Uses cosine similarity to find movies similar to user's rated movies

3. **Hybrid Scoring**: Combines both approaches with weights:
   - Genre match: 50%
   - Collaborative score: 40%
   - Popularity: 10%

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  email: string (unique),
  password: string (hashed),
  username: string,
  favoriteGenres: [string],
  createdAt: Date,
  updatedAt: Date
}
```

### Movies Collection
```javascript
{
  _id: ObjectId,
  title: string,
  description: string,
  genres: [string],
  year: number,
  poster_url: string,
  director: string,
  cast_members: [string],
  averageRating: number,
  ratingCount: number
}
```

### Ratings Collection
```javascript
{
  userId: ObjectId,
  movieId: ObjectId,
  rating: number (1-5),
  updatedAt: Date
}
```

### Watchlist Collection
```javascript
{
  userId: ObjectId,
  movieId: ObjectId,
  addedAt: Date
}
```

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/movie-recommendation
PORT=5000
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
PYTHON_ML_SERVER=http://localhost:5001
FRONTEND_URL=http://localhost:5173
```

### ML Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/movie-recommendation
ML_PORT=5001
NODE_BACKEND_URL=http://localhost:5000
```

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:5000/api
```

## Running All Services

You can run all three services simultaneously:

**Terminal 1 - Backend**
```bash
cd backend
npm run dev
```

**Terminal 2 - ML Backend**
```bash
cd ml-backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python -m src.app
```

**Terminal 3 - Frontend**
```bash
npm run dev
```

Access the application at `http://localhost:5173`

## Building for Production

### Frontend
```bash
npm run build
npm run preview
```

### Backend
```bash
cd backend
npm install --production
npm start
```

### ML Backend
```bash
cd ml-backend
pip install -r requirements.txt
python -m src.app
```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB service is running
- Check connection string in `.env`
- Verify network access if using MongoDB Atlas

### CORS Errors
- Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL
- Check that all servers are running on correct ports

### ML Backend Not Responding
- Ensure Python virtual environment is activated
- Check that TensorFlow is installed: `pip list | grep tensorflow`
- Verify `PYTHON_ML_SERVER` URL in backend `.env`

### Port Already in Use
- Change port in respective `.env` files
- Or kill process using the port:
  - Windows: `netstat -ano | findstr :5000` then `taskkill /PID <PID>`
  - macOS/Linux: `lsof -i :5000` then `kill -9 <PID>`

## Future Enhancements

- [ ] Advanced ML model training with user feedback
- [ ] Movie streaming integration
- [ ] Social features (follow users, share recommendations)
- [ ] Email notifications for new recommendations
- [ ] Admin dashboard for movie management
- [ ] Docker containerization
- [ ] Real-time recommendation updates

## License

MIT

## Contributing

Feel free to open issues and submit pull requests for bug fixes or features!
