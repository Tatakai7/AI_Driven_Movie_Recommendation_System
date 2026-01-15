from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from src.config import MONGODB_URI, PORT, NODE_BACKEND_URL
from src.model import recommendation_model
import os

app = Flask(__name__)
CORS(app)

# MongoDB connection
try:
    mongo_client = MongoClient(MONGODB_URI)
    db = mongo_client['movie-recommendation']
    print("Connected to MongoDB")
except Exception as e:
    print(f"MongoDB connection error: {e}")

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'OK'})

@app.route('/recommendations', methods=['POST'])
def get_recommendations():
    try:
        data = request.json
        user_id = data.get('userId')
        user_ratings = data.get('userRatings', [])
        favorite_genres = data.get('favoriteGenres', [])
        limit = data.get('limit', 10)

        # Fetch all movies from MongoDB
        movies_collection = db['movies']
        all_movies = list(movies_collection.find({}))

        # Get recommendations from model
        recommendations = recommendation_model.get_recommendations(
            user_ratings=user_ratings,
            user_genres=favorite_genres,
            all_movies=all_movies,
            limit=limit
        )

        return jsonify({
            'recommendations': recommendations,
            'count': len(recommendations)
        })

    except Exception as e:
        print(f"Error in recommendations: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/train', methods=['POST'])
def train_model():
    """Endpoint to trigger model training/retraining"""
    try:
        data = request.json
        user_id = data.get('userId')

        # Fetch user data from MongoDB
        ratings_collection = db['ratings']
        users_collection = db['users']

        user_ratings = list(ratings_collection.find({'userId': user_id}))
        user = users_collection.find_one({'_id': user_id})

        if not user or not user_ratings:
            return jsonify({'error': 'Insufficient data for training'}), 400

        # Build and train model (simplified version)
        num_movies = db['movies'].count_documents({})
        recommendation_model.build_model(num_movies, 20)

        return jsonify({
            'status': 'Model training completed',
            'user_id': str(user_id),
            'ratings_count': len(user_ratings)
        })

    except Exception as e:
        print(f"Error in training: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/stats', methods=['GET'])
def get_stats():
    """Get recommendation engine stats"""
    try:
        movies_count = db['movies'].count_documents({})
        users_count = db['users'].count_documents({})
        ratings_count = db['ratings'].count_documents({})
        watchlist_count = db['watchlist'].count_documents({})

        return jsonify({
            'movies': movies_count,
            'users': users_count,
            'ratings': ratings_count,
            'watchlist': watchlist_count
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=PORT, debug=True)
