import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.metrics.pairwise import cosine_similarity
import tensorflow as tf
from tensorflow import keras

class MovieRecommendationModel:
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.genre_encoder = {}
        self.movie_embeddings = {}

    def build_model(self, num_movies, num_genres):
        """Build a neural network for collaborative filtering"""
        input_user = keras.Input(shape=(1,), name='user_input')
        input_movie = keras.Input(shape=(1,), name='movie_input')

        # Embedding layers
        user_embed = keras.layers.Embedding(10000, 64)(input_user)
        user_embed = keras.layers.Flatten()(user_embed)

        movie_embed = keras.layers.Embedding(num_movies, 64)(input_movie)
        movie_embed = keras.layers.Flatten()(movie_embed)

        # Merge embeddings
        merged = keras.layers.Concatenate()([user_embed, movie_embed])
        dense = keras.layers.Dense(128, activation='relu')(merged)
        dense = keras.layers.Dropout(0.2)(dense)
        dense = keras.layers.Dense(64, activation='relu')(dense)
        output = keras.layers.Dense(1, activation='sigmoid')(dense)

        self.model = keras.Model(inputs=[input_user, input_movie], outputs=output)
        self.model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['mae'])

    def extract_features(self, movie, user_ratings, user_genres):
        """Extract features from movie data"""
        features = []

        # Genre match score
        genre_match = sum(1 for g in movie.get('genres', []) if g in user_genres) / max(1, len(movie.get('genres', [])))
        features.append(genre_match)

        # Rating score (normalized to 0-1)
        rating = movie.get('averageRating', 0) / 5.0
        features.append(rating)

        # Popularity score (based on rating count)
        popularity = min(1.0, movie.get('ratingCount', 0) / 1000)
        features.append(popularity)

        # Year recency score
        year = movie.get('year', 2000)
        recency = min(1.0, (year - 1970) / 53)
        features.append(recency)

        return np.array(features)

    def get_recommendations(self, user_ratings, user_genres, all_movies, limit=10):
        """
        Generate recommendations using content-based and collaborative filtering
        """
        recommendations = []

        # Calculate scores for each movie
        rated_movie_ids = set(r['movieId'] for r in user_ratings)

        for movie in all_movies:
            # Skip already rated movies
            if movie['_id'] in rated_movie_ids:
                continue

            # Extract features
            features = self.extract_features(movie, user_ratings, user_genres)

            # Content-based score
            content_score = np.mean(features[:2])  # Genre and rating

            # Collaborative score based on user's rated movies
            collab_score = 0.5
            if user_ratings:
                rated_movies_features = [
                    self.extract_features(
                        next((m for m in all_movies if str(m['_id']) == r['movieId']), movie),
                        user_ratings,
                        user_genres
                    )
                    for r in user_ratings
                ]
                if rated_movies_features:
                    similarity = cosine_similarity(
                        [features],
                        rated_movies_features
                    )[0]
                    collab_score = np.mean(similarity)

            # Hybrid score
            final_score = content_score * 0.6 + collab_score * 0.4

            recommendations.append({
                'movieId': str(movie['_id']),
                'score': float(final_score),
                'title': movie.get('title', ''),
            })

        # Sort and return top recommendations
        recommendations.sort(key=lambda x: x['score'], reverse=True)
        return recommendations[:limit]

# Initialize global model
recommendation_model = MovieRecommendationModel()
