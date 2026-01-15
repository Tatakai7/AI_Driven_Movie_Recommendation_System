import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import * as api from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { MovieCard } from '../components/MovieCard';
import { MovieDetails } from '../components/MovieDetails';

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
    try {
      const [moviesData, watchlistData] = await Promise.all([
        api.getMovies({ limit: 100 }),
        api.getWatchlist(),
      ]);

      setMovies(moviesData.movies || []);
      setWatchlistIds(new Set((watchlistData.movies || []).map((m: Movie) => m._id)));
    } catch (error) {
      console.error('Failed to load data:', error);
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

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovie(movie);
    // Similar movies would be fetched from recommendations
    setSimilarMovies([]);
  };

  const handleToggleWatchlist = async (movieId: string) => {
    try {
      if (watchlistIds.has(movieId)) {
        await api.removeFromWatchlist(movieId);
        setWatchlistIds((prev) => {
          const next = new Set(prev);
          next.delete(movieId);
          return next;
        });
      } else {
        await api.addToWatchlist(movieId);
        setWatchlistIds((prev) => new Set(prev).add(movieId));
      }
    } catch (error) {
      console.error('Failed to toggle watchlist:', error);
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
                key={movie._id}
                movie={movie}
                isInWatchlist={watchlistIds.has(movie._id)}
                onToggleWatchlist={() => handleToggleWatchlist(movie._id)}
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
          isInWatchlist={watchlistIds.has(selectedMovie._id)}
          similarMovies={similarMovies}
          onMovieSelect={handleMovieClick}
        />
      )}
    </div>
  );
}
