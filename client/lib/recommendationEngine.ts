import * as api from './api';

interface Movie {
  _id: string;
  title: string;
  description: string;
  genres: string[];
  year: number;
  poster_url: string;
  director: string;
  cast_members: string[];
  averageRating: number;
  ratingCount: number;
}

interface UserRating {
  movieId: string;
  rating: number;
}

interface GenrePreference {
  [genre: string]: number;
}

export class RecommendationEngine {
  private genrePreferences: GenrePreference = {};

  calculateGenrePreferences(userRatings: UserRating[], allMovies: Movie[], favoriteGenres: string[]) {
    this.genrePreferences = {};

    // Weight favorite genres
    favoriteGenres.forEach(genre => {
      this.genrePreferences[genre] = (this.genrePreferences[genre] || 0) + 2;
    });

    // Weight genres from highly rated movies
    userRatings.forEach(rating => {
      const movie = allMovies.find(m => m._id === rating.movieId);
      if (movie && rating.rating >= 4) {
        movie.genres.forEach(genre => {
          this.genrePreferences[genre] = (this.genrePreferences[genre] || 0) + (rating.rating / 5);
        });
      }
    });

    // Normalize
    const totalWeight = Object.values(this.genrePreferences).reduce((sum, val) => sum + val, 0);
    if (totalWeight > 0) {
      Object.keys(this.genrePreferences).forEach(genre => {
        this.genrePreferences[genre] = this.genrePreferences[genre] / totalWeight;
      });
    }
  }

  calculateMovieScore(movie: Movie, userRatings: UserRating[]): number {
    const ratedMovieIds = new Set(userRatings.map(r => r.movieId));
    if (ratedMovieIds.has(movie._id)) {
      return -1;
    }

    let genreScore = 0;
    movie.genres.forEach(genre => {
      genreScore += this.genrePreferences[genre] || 0;
    });

    const ratingScore = movie.ratingCount > 0 ? movie.averageRating / 5 : 0;
    const popularityScore = Math.log(movie.ratingCount + 1) / 10;
    const recentYearScore = Math.max(0, (movie.year - 1970) / 54);

    const finalScore =
      genreScore * 0.5 +
      ratingScore * 0.25 +
      popularityScore * 0.15 +
      recentYearScore * 0.1;

    return finalScore;
  }

  async getRecommendations(userId: string, limit: number = 10): Promise<Movie[]> {
    try {
      // Fetch recommendations from backend (which uses Python ML)
      const response = await api.getRecommendations(limit);
      return response.movies || [];
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      return [];
    }
  }

  scoreAndRankMovies(
    movies: Movie[],
    userRatings: UserRating[],
    favoriteGenres: string[]
  ): Movie[] {
    this.calculateGenrePreferences(userRatings, movies, favoriteGenres);

    const scored = movies
      .map(movie => ({
        movie,
        score: this.calculateMovieScore(movie, userRatings),
      }))
      .filter(item => item.score >= 0)
      .sort((a, b) => b.score - a.score);

    return scored.map(item => item.movie);
  }
}
      .sort((a, b) => b.score - a.score);

    return scoredMovies.slice(0, limit).map(item => item.movie);
  }

  getSimilarMovies(movieId: string, limit: number = 6): Movie[] {
    const targetMovie = this.allMovies.find(m => m.id === movieId);
    if (!targetMovie) return [];

    const targetGenres = new Set(targetMovie.genres);

    const similarMovies = this.allMovies
      .filter(movie => movie.id !== movieId)
      .map(movie => {
        const commonGenres = movie.genres.filter(g => targetGenres.has(g)).length;
        const genreScore = commonGenres / Math.max(targetMovie.genres.length, movie.genres.length);

        const yearDiff = Math.abs(movie.year - targetMovie.year);
        const yearScore = Math.max(0, 1 - yearDiff / 50);

        const ratingScore = movie.rating_count > 0 ? movie.average_rating / 5 : 0;

        const totalScore = genreScore * 0.6 + yearScore * 0.2 + ratingScore * 0.2;

        return { movie, score: totalScore };
      })
      .sort((a, b) => b.score - a.score);

    return similarMovies.slice(0, limit).map(item => item.movie);
  }

  async updateUserPreferences(userId: string) {
    await supabase
      .from('user_preferences')
      .upsert({
        user_id: userId,
        preference_vector: this.genrePreferences,
        updated_at: new Date().toISOString(),
      });
  }
}
