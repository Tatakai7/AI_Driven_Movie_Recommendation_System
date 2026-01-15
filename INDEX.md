# 🎬 AI Driven Movie Recommendation System

## 📋 Documentation Index

Welcome! Your Movie Recommendation System has been successfully migrated to a modern tech stack. Start here:

### 🚀 Getting Started

1. **[Quick Start Guide](COMPLETION_REPORT.md)** - Start here first!
   - Overview of changes
   - Quick commands
   - File structure
   
2. **[Setup Instructions](SETUP.md)** - Detailed setup guide
   - Prerequisites
   - Step-by-step setup
   - Troubleshooting

3. **[Run Quick Start Script](quickstart.sh)** (Linux/macOS) or **[quickstart.bat](quickstart.bat)** (Windows)
   - Automated setup
   - All dependencies installed
   - Ready to run

### 📚 API Documentation

- **[API Reference](API_REFERENCE.md)** - Complete API documentation
  - All endpoints
  - Request/response examples
  - Code samples (cURL, Python, JavaScript)
  - Error codes

### 📝 Technical Documentation

- **[Migration Summary](MIGRATION_SUMMARY.md)** - Technical migration details
  - Architecture changes
  - Technology stack
  - ML algorithm explanation
  - Database schema

- **[Project Structure](#project-structure)** - Directory layout
- **[Tech Stack](#tech-stack)** - Technologies used
- **[Features](#features)** - What's included

---

## 🎯 Quick Commands

### Start All Services

**Linux/macOS:**
```bash
bash quickstart.sh
```

**Windows:**
```bash
quickstart.bat
```

### Manual Start

**Terminal 1 - Backend**
```bash
cd backend && npm install && npm run dev
```

**Terminal 2 - ML Backend**
```bash
cd ml-backend && python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python -m src.app
```

**Terminal 3 - Frontend**
```bash
npm install && npm run dev
```

### Access the App
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- ML Server: http://localhost:5001

---

## 📦 Tech Stack

| Component | Technology |
|-----------|-----------|
| **Frontend** | React 19 + TypeScript + Tailwind CSS |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB |
| **ML Engine** | Python + TensorFlow |
| **Authentication** | JWT + bcryptjs |
| **Containerization** | Docker + Docker Compose |

---

## 🌟 Features

### User Management
- ✅ User registration & login
- ✅ JWT authentication
- ✅ Profile management
- ✅ Favorite genres selection

### Movie Discovery
- ✅ Browse movies
- ✅ Search by title/director
- ✅ Filter by genre
- ✅ View movie details

### Interactive Features
- ✅ Rate movies (1-5)
- ✅ Save to watchlist
- ✅ View user watchlist
- ✅ Personalized recommendations

### ML Recommendations
- ✅ Hybrid recommendation engine
- ✅ Content-based filtering
- ✅ Collaborative filtering
- ✅ Genre preference learning

---

## 📁 Project Structure

```
AI_Driven_Movie_Recommendation_System/
│
├── backend/                          # Node.js API Server
│   ├── src/
│   │   ├── controllers/              # Request handlers
│   │   ├── routes/                   # API routes
│   │   ├── middleware/               # Auth & middleware
│   │   ├── database.js               # MongoDB connection
│   │   └── server.js                 # Express setup
│   ├── scripts/
│   │   └── seedMovies.js             # Database seeding
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
│
├── ml-backend/                       # Python ML Server
│   ├── src/
│   │   ├── app.py                    # Flask server
│   │   ├── model.py                  # TensorFlow model
│   │   └── config.py                 # Configuration
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
│
├── src/                              # React Frontend
│   ├── components/                   # UI components
│   ├── contexts/                     # React contexts
│   ├── lib/
│   │   ├── api.ts                    # API client (NEW)
│   │   └── recommendationEngine.ts   # ML integration
│   ├── views/                        # Page components
│   ├── App.tsx
│   └── main.tsx
│
├── Documentation/
│   ├── SETUP.md                      # Setup guide
│   ├── API_REFERENCE.md              # API docs
│   ├── MIGRATION_SUMMARY.md          # Technical details
│   ├── COMPLETION_REPORT.md          # What's included
│   └── README.md                     # This file
│
├── Configuration/
│   ├── docker-compose.yml            # Docker setup
│   ├── .env.local                    # Frontend env
│   ├── vite.config.ts                # Build config
│   └── tsconfig.json                 # TypeScript config
│
└── Scripts/
    ├── quickstart.sh                 # Linux/macOS setup
    └── quickstart.bat                # Windows setup
```

---

## 🔐 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcryptjs with salt rounds
- **CORS**: Cross-origin request handling
- **Error Handling**: Sanitized error messages
- **Database Indexing**: Optimized queries

---

## 📊 API Overview

### Authentication (4 endpoints)
- Register user
- Login user
- Get profile
- Update profile

### Movies (5 endpoints)
- Get all movies
- Get movie details
- Rate movie
- Get user rating
- Get recommendations

### Watchlist (4 endpoints)
- Get watchlist
- Add to watchlist
- Remove from watchlist
- Check watchlist status

**Total: 13 REST endpoints + ML inference endpoints**

---

## 🧠 ML Recommendation Algorithm

The system uses a **hybrid approach** combining:

1. **Content-Based Filtering** (50%)
   - Genre matching
   - Movie quality (rating, popularity)
   - Recency (year released)

2. **Collaborative Filtering** (40%)
   - User similarity
   - Movie similarity
   - Cosine similarity scoring

3. **Popularity Boost** (10%)
   - Rating count
   - Average rating
   - Trending movies

---

## 🐳 Docker Support

Run everything with Docker Compose:

```bash
docker-compose up -d
```

Services:
- MongoDB (port 27017)
- Backend (port 5000)
- ML Backend (port 5001)

---

## 📈 Performance

- **Database**: Indexed for fast queries
- **API**: RESTful, stateless design
- **ML**: Efficient tensor operations
- **Caching**: Token-based caching
- **Scalability**: Microservices architecture

---

## 🐛 Troubleshooting

### MongoDB Connection Error
→ See [SETUP.md](SETUP.md#troubleshooting)

### Port Already in Use
→ See [SETUP.md](SETUP.md#troubleshooting)

### ML Backend Not Responding
→ See [SETUP.md](SETUP.md#troubleshooting)

---

## 📚 Learn More

- **Frontend**: `src/App.tsx` - Main React component
- **Backend**: `backend/src/server.js` - Express setup
- **ML Model**: `ml-backend/src/model.py` - Recommendation engine
- **API Client**: `src/lib/api.ts` - Frontend API service

---

## 🚢 Deployment

### Production Checklist
- [ ] Update JWT_SECRET
- [ ] Configure MongoDB production instance
- [ ] Set NODE_ENV=production
- [ ] Configure domain names
- [ ] Set up SSL/TLS
- [ ] Configure environment variables
- [ ] Test all endpoints
- [ ] Set up monitoring
- [ ] Configure backups

### Deployment Options
- Docker Compose (recommended for small scale)
- Kubernetes (for large scale)
- Cloud platforms (AWS, Google Cloud, Azure)

---

## 💡 Tips

1. **First Time Setup**: Run `quickstart.sh` or `quickstart.bat`
2. **Add Sample Data**: Run `cd backend && node scripts/seedMovies.js`
3. **Test API**: Check [API_REFERENCE.md](API_REFERENCE.md) for examples
4. **Monitor**: Check backend and ML server logs during testing
5. **Debug**: Use browser DevTools for frontend debugging

---

## 📞 Support

- **Documentation**: See the provided `.md` files
- **API Issues**: Check [API_REFERENCE.md](API_REFERENCE.md)
- **Setup Issues**: Check [SETUP.md](SETUP.md)
- **Architecture**: Check [MIGRATION_SUMMARY.md](MIGRATION_SUMMARY.md)

---

## ✅ Verification Checklist

- [ ] MongoDB is running
- [ ] Backend API started (port 5000)
- [ ] ML Server started (port 5001)
- [ ] Frontend running (port 5173)
- [ ] Can register user
- [ ] Can login
- [ ] Can browse movies
- [ ] Can rate movies
- [ ] Can add to watchlist
- [ ] Get recommendations
- [ ] Can update profile

---

## 🎓 Learning Resources

- **Node.js**: https://nodejs.org/docs
- **Express**: https://expressjs.com
- **MongoDB**: https://docs.mongodb.com
- **TensorFlow**: https://www.tensorflow.org/api
- **React**: https://react.dev
- **TypeScript**: https://www.typescriptlang.org

---

## 📄 Files You Should Read

1. **First**: [COMPLETION_REPORT.md](COMPLETION_REPORT.md)
2. **Then**: [SETUP.md](SETUP.md)
3. **For API**: [API_REFERENCE.md](API_REFERENCE.md)
4. **For Details**: [MIGRATION_SUMMARY.md](MIGRATION_SUMMARY.md)

---

**Status**: ✅ Complete and Ready for Testing  
**Last Updated**: January 15, 2026  
**Version**: 1.0.0

---

## 🎉 You're All Set!

Your system is ready to run. Start with one of these:

```bash
# Option 1: Automated setup (Recommended)
bash quickstart.sh              # Linux/macOS
quickstart.bat                  # Windows

# Option 2: Manual setup
# See SETUP.md for step-by-step instructions

# Option 3: Docker
docker-compose up -d
```

Then visit: **http://localhost:5173** 🚀

Happy coding! 🎬✨
