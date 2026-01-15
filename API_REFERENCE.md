# API Reference

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## Authentication Endpoints

### Register User
```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "username": "john_doe"
}

Response: 201 Created
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "username": "john_doe",
    "favoriteGenres": []
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login User
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}

Response: 200 OK
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "username": "john_doe",
    "favoriteGenres": ["Action", "Sci-Fi"]
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Get User Profile
```
GET /auth/profile
Authorization: Bearer <TOKEN>

Response: 200 OK
{
  "id": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "username": "john_doe",
  "favoriteGenres": ["Action", "Sci-Fi"]
}
```

### Update User Profile
```
PUT /auth/profile
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "username": "john_doe_updated",
  "favoriteGenres": ["Action", "Drama", "Sci-Fi"]
}

Response: 200 OK
{
  "id": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "username": "john_doe_updated",
  "favoriteGenres": ["Action", "Drama", "Sci-Fi"]
}
```

---

## Movie Endpoints

### Get All Movies
```
GET /movies?genre=Action&search=Batman&limit=20&skip=0
Authorization: Bearer <TOKEN>

Query Parameters:
- genre (string): Filter by genre (optional)
- search (string): Search by title, director, or description (optional)
- limit (number): Number of results (default: 20)
- skip (number): Number of results to skip for pagination (default: 0)

Response: 200 OK
{
  "movies": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "The Dark Knight",
      "description": "When the menace known as the Joker wreaks havoc...",
      "genres": ["Action", "Crime", "Drama"],
      "year": 2008,
      "poster_url": "https://...",
      "director": "Christopher Nolan",
      "cast_members": ["Christian Bale", "Heath Ledger"],
      "averageRating": 9.0,
      "ratingCount": 2500000
    }
  ],
  "total": 145,
  "limit": 20,
  "skip": 0
}
```

### Get Movie Details
```
GET /movies/507f1f77bcf86cd799439011
Authorization: Bearer <TOKEN>

Response: 200 OK
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "The Dark Knight",
  "description": "When the menace known as the Joker wreaks havoc...",
  "genres": ["Action", "Crime", "Drama"],
  "year": 2008,
  "poster_url": "https://...",
  "director": "Christopher Nolan",
  "cast_members": ["Christian Bale", "Heath Ledger"],
  "averageRating": 9.0,
  "ratingCount": 2500000
}
```

### Rate a Movie
```
POST /movies/rate
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "movieId": "507f1f77bcf86cd799439011",
  "rating": 5
}

Response: 200 OK
{
  "success": true,
  "rating": 5
}
```

### Get User's Rating for a Movie
```
GET /movies/507f1f77bcf86cd799439011/rating
Authorization: Bearer <TOKEN>

Response: 200 OK
{
  "rating": 5
}

Response: 200 OK (if not rated)
{
  "rating": null
}
```

### Get Personalized Recommendations
```
GET /movies/recommendations?limit=10
Authorization: Bearer <TOKEN>

Query Parameters:
- limit (number): Number of recommendations (default: 10)

Response: 200 OK
{
  "movies": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Inception",
      "description": "A thief who steals corporate secrets...",
      "genres": ["Sci-Fi", "Action"],
      "year": 2010,
      "poster_url": "https://...",
      "director": "Christopher Nolan",
      "cast_members": ["Leonardo DiCaprio"],
      "averageRating": 8.8,
      "ratingCount": 2000000
    }
  ]
}
```

---

## Watchlist Endpoints

### Get User's Watchlist
```
GET /watchlist
Authorization: Bearer <TOKEN>

Response: 200 OK
{
  "movies": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "The Dark Knight",
      "description": "...",
      "genres": ["Action", "Crime", "Drama"],
      "year": 2008,
      "poster_url": "https://...",
      "director": "Christopher Nolan",
      "cast_members": ["Christian Bale", "Heath Ledger"],
      "averageRating": 9.0,
      "ratingCount": 2500000
    }
  ]
}
```

### Add Movie to Watchlist
```
POST /watchlist
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "movieId": "507f1f77bcf86cd799439011"
}

Response: 200 OK
{
  "success": true
}
```

### Remove Movie from Watchlist
```
DELETE /watchlist/507f1f77bcf86cd799439011
Authorization: Bearer <TOKEN>

Response: 200 OK
{
  "success": true
}
```

### Check if Movie is in Watchlist
```
GET /watchlist/507f1f77bcf86cd799439011
Authorization: Bearer <TOKEN>

Response: 200 OK
{
  "inWatchlist": true
}

Response: 200 OK
{
  "inWatchlist": false
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid movie ID or rating"
}
```

### 401 Unauthorized
```json
{
  "error": "No token provided"
}
```

```json
{
  "error": "Invalid token"
}
```

### 404 Not Found
```json
{
  "error": "Movie not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request succeeded |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Auth required |
| 404 | Not Found - Resource doesn't exist |
| 500 | Server Error - Internal error |

---

## Rate Limiting

No rate limiting is currently implemented. In production, consider implementing:
- IP-based rate limiting
- Per-user rate limiting
- Endpoint-specific limits

---

## Data Types

### Movie Object
```typescript
{
  _id: string (ObjectId)
  title: string
  description: string
  genres: string[]
  year: number
  poster_url: string
  director: string
  cast_members: string[]
  averageRating: number (0-5)
  ratingCount: number
}
```

### User Object
```typescript
{
  id: string
  email: string
  username: string
  favoriteGenres: string[]
}
```

### Rating
```typescript
{
  value: number (1-5)
}
```

---

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "username": "testuser"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Movies
```bash
curl -X GET "http://localhost:5000/api/movies?genre=Action&limit=5" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Rate a Movie
```bash
curl -X POST http://localhost:5000/api/movies/rate \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "movieId": "507f1f77bcf86cd799439011",
    "rating": 5
  }'
```

---

## Python Example

```python
import requests

BASE_URL = "http://localhost:5000/api"

# Register
response = requests.post(
    f"{BASE_URL}/auth/register",
    json={
        "email": "user@example.com",
        "password": "password123",
        "username": "username"
    }
)
token = response.json()["token"]

# Get movies
headers = {"Authorization": f"Bearer {token}"}
response = requests.get(
    f"{BASE_URL}/movies",
    params={"genre": "Action", "limit": 10},
    headers=headers
)
movies = response.json()["movies"]

# Rate a movie
response = requests.post(
    f"{BASE_URL}/movies/rate",
    json={"movieId": "507f1f77bcf86cd799439011", "rating": 5},
    headers=headers
)
```

---

## JavaScript/Fetch Example

```javascript
const BASE_URL = "http://localhost:5000/api";

// Register
const registerResponse = await fetch(`${BASE_URL}/auth/register`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "user@example.com",
    password: "password123",
    username: "username"
  })
});
const { token } = await registerResponse.json();

// Get movies
const moviesResponse = await fetch(
  `${BASE_URL}/movies?genre=Action&limit=10`,
  {
    headers: { "Authorization": `Bearer ${token}` }
  }
);
const { movies } = await moviesResponse.json();

// Rate a movie
await fetch(`${BASE_URL}/movies/rate`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  },
  body: JSON.stringify({
    movieId: "507f1f77bcf86cd799439011",
    rating: 5
  })
});
```
