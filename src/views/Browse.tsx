import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
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

const GENRES = [
  'Action',
  'Adventure',
  'Animation',
  'Biography',
  'Comedy',
  'Crime',
  'Drama',
  'Fantasy',
  'History',
  'Mystery',
  'Romance',
  'Sci-Fi',
  'Thriller',
  'War',
  'Western',
];

export function Browse() {
  const { user } = useAuth();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [watchlistIds, setWatchlistIds] = useState<Set<string>>(new Set());
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterMovies();
  }, [searchQuery, selectedGenre, movies]);

  const loadData = async () => {
    setLoading(true);
    const [moviesResponse, watchlistResponse] = await Promise.all([
      supabase.from('movies').select('*').order('average_rating', { ascending: false }),
      supabase.from('watchlist').select('movie_id').eq('user_id', user!.id),
    ]);

    if (moviesResponse.data) {
      setMovies(moviesResponse.data);
    }

    if (watchlistResponse.data) {
      setWatchlistIds(new Set(watchlistResponse.data.map((w) => w.movie_id)));
    }

    setLoading(false);
  };

  const filterMovies = () => {
    let filtered = movies;

    if (searchQuery) {
      filtered = filtered.filter(
        (movie) =>
          movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          movie.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          movie.director.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedGenre !== 'All') {
      filtered = filtered.filter((movie) => movie.genres.includes(selectedGenre));
    }

    setFilteredMovies(filtered);
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
        <div className="text-white text-xl">Loading movies...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-6">Browse Movies</h1>

          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies, directors, or keywords..."
              className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedGenre('All')}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                selectedGenre === 'All'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              All Genres
            </button>
            {GENRES.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  selectedGenre === genre
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {filteredMovies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">No movies found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredMovies.map((movie) => (
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
          onUpdate={loadData}
          isInWatchlist={watchlistIds.has(selectedMovie.id)}
          similarMovies={similarMovies}
          onMovieSelect={handleMovieClick}
        />
      )}
    </div>
  );
}
