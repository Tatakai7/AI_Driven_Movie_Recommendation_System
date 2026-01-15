import { useState, useEffect } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { MovieCard } from '../components/MovieCard';
import { MovieDetails } from '../components/MovieDetails';
import { RecommendationEngine } from '../lib/recommendationEngine';

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

export function Recommendations() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [watchlistIds, setWatchlistIds] = useState<Set<string>>(new Set());
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    setLoading(true);
    const engine = new RecommendationEngine();
    await engine.initialize(user!.id);
    const recommended = engine.getRecommendations(20);
    setRecommendations(recommended);

    await engine.updateUserPreferences(user!.id);

    const watchlistResponse = await supabase
      .from('watchlist')
      .select('movie_id')
      .eq('user_id', user!.id);

    if (watchlistResponse.data) {
      setWatchlistIds(new Set(watchlistResponse.data.map((w) => w.movie_id)));
    }

    setLoading(false);
  };

  const handleMovieClick = async (movie: Movie) => {
    setSelectedMovie(movie);
    const engine = new RecommendationEngine();
    await engine.initialize(user!.id);
    const similar = engine.getSimilarMovies(movie.id);
    setSimilarMovies(similar);
  };

  const handleToggleWatchlist = async (movieId: string) => {
    if (watchlistIds.has(movieId)) {
      await supabase.from('watchlist').delete().eq('user_id', user!.id).eq('movie_id', movieId);
      setWatchlistIds((prev) => {
        const next = new Set(prev);
        next.delete(movieId);
        return next;
      });
    } else {
      await supabase.from('watchlist').insert({
        user_id: user!.id,
        movie_id: movieId,
      });
      setWatchlistIds((prev) => new Set(prev).add(movieId));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Sparkles className="w-12 h-12 text-blue-500 animate-pulse mx-auto mb-4" />
          <div className="text-white text-xl">Generating personalized recommendations...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-blue-500" />
              Recommended For You
            </h1>
            <p className="text-slate-400">
              Based on your ratings and favorite genres
            </p>
          </div>

          <button
            onClick={loadRecommendations}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {recommendations.length === 0 ? (
          <div className="text-center py-12 bg-slate-800 rounded-lg border border-slate-700">
            <Sparkles className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No recommendations yet</h3>
            <p className="text-slate-400 mb-6">
              Rate some movies and set your favorite genres to get personalized recommendations
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {recommendations.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                isInWatchlist={watchlistIds.has(movie.id)}
                onToggleWatchlist={() => handleToggleWatchlist(movie.id)}
                onClick={() => handleMovieClick(movie)}
              />
            ))}
          </div>
        )}
      </div>

      {selectedMovie && (
        <MovieDetails
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          onUpdate={loadRecommendations}
          isInWatchlist={watchlistIds.has(selectedMovie.id)}
          similarMovies={similarMovies}
          onMovieSelect={handleMovieClick}
        />
      )}
    </div>
  );
}
