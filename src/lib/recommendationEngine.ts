import { supabase } from './supabase';

interface Movie {
  id: string;
  title: string;
  description: string;
  genres: string[];
  year: number;
  poster_url: string;
  director: string;
  cast_members: string[];
  average_rating: number;
  rating_count: number;
}

interface UserRating {
  movie_id: string;
  rating: number;
}

interface GenrePreference {
  [genre: string]: number;
}

export class RecommendationEngine {
  private allMovies: Movie[] = [];
  private userRatings: UserRating[] = [];
  private favoriteGenres: string[] = [];
  private genrePreferences: GenrePreference = {};

  async initialize(userId: string) {
    const [moviesResponse, ratingsResponse, profileResponse] = await Promise.all([
      supabase.from('movies').select('*'),
      supabase.from('ratings').select('movie_id, rating').eq('user_id', userId),
      supabase.from('profiles').select('favorite_genres').eq('id', userId).maybeSingle(),
    ]);

    this.allMovies = moviesResponse.data || [];
    this.userRatings = ratingsResponse.data || [];
    this.favoriteGenres = profileResponse.data?.favorite_genres || [];

    this.calculateGenrePreferences();
  }

  private calculateGenrePreferences() {
    this.genrePreferences = {};

    this.favoriteGenres.forEach(genre => {
      this.genrePreferences[genre] = (this.genrePreferences[genre] || 0) + 2;
    });

    this.userRatings.forEach(rating => {
      const movie = this.allMovies.find(m => m.id === rating.movie_id);
      if (movie && rating.rating >= 4) {
        movie.genres.forEach(genre => {
          this.genrePreferences[genre] = (this.genrePreferences[genre] || 0) + (rating.rating / 5);
        });
      }
    });

    const totalWeight = Object.values(this.genrePreferences).reduce((sum, val) => sum + val, 0);
    if (totalWeight > 0) {
      Object.keys(this.genrePreferences).forEach(genre => {
        this.genrePreferences[genre] = this.genrePreferences[genre] / totalWeight;
      });
    }
  }

  private calculateMovieScore(movie: Movie): number {
    const ratedMovieIds = new Set(this.userRatings.map(r => r.movie_id));
    if (ratedMovieIds.has(movie.id)) {
      return -1;
    }

    let genreScore = 0;
    movie.genres.forEach(genre => {
      genreScore += this.genrePreferences[genre] || 0;
    });

    const ratingScore = movie.rating_count > 0 ? movie.average_rating / 5 : 0;
    const popularityScore = Math.log(movie.rating_count + 1) / 10;

    const recentYearScore = Math.max(0, (movie.year - 1970) / 56);

    const finalScore =
      genreScore * 0.5 +
      ratingScore * 0.25 +
      popularityScore * 0.15 +
      recentYearScore * 0.1;

    return finalScore;
  }

  getRecommendations(limit: number = 10): Movie[] {
    const scoredMovies = this.allMovies
      .map(movie => ({
        movie,
        score: this.calculateMovieScore(movie),
      }))
      .filter(item => item.score >= 0)
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
