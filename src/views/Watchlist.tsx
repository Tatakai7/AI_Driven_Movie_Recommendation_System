import { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';
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

interface WatchlistItem {
  movie_id: string;
  added_at: string;
  movies: Movie;
}

export function Watchlist() {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWatchlist();
  }, []);

  const loadWatchlist = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('watchlist')
      .select('movie_id, added_at, movies(*)')
      .eq('user_id', user!.id)
      .order('added_at', { ascending: false });

    if (data) {
      const movies = data.map((item: WatchlistItem) => item.movies);
      setWatchlist(movies);
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

  const handleRemoveFromWatchlist = async (movieId: string) => {
    await supabase
      .from('watchlist')
      .delete()
      .eq('user_id', user!.id)
      .eq('movie_id', movieId);

    setWatchlist((prev) => prev.filter((m) => m.id !== movieId));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Loading watchlist...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Bookmark className="w-8 h-8 text-blue-500" />
            My Watchlist
          </h1>
          <p className="text-slate-400">
            {watchlist.length} {watchlist.length === 1 ? 'movie' : 'movies'} saved
          </p>
        </div>

        {watchlist.length === 0 ? (
          <div className="text-center py-12 bg-slate-800 rounded-lg border border-slate-700">
            <Bookmark className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Your watchlist is empty</h3>
            <p className="text-slate-400">
              Browse movies and add them to your watchlist to watch later
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {watchlist.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                isInWatchlist={true}
                onToggleWatchlist={() => handleRemoveFromWatchlist(movie.id)}
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
          onUpdate={loadWatchlist}
          isInWatchlist={true}
          similarMovies={similarMovies}
          onMovieSelect={handleMovieClick}
        />
      )}
    </div>
  );
}
