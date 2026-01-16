import { useState, useEffect } from 'react';
import { X, Star, Bookmark, BookmarkCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { MovieCard } from './MovieCard';

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

interface MovieDetailsProps {
  movie: Movie;
  onClose: () => void;
  onUpdate: () => void;
  isInWatchlist: boolean;
  similarMovies: Movie[];
  onMovieSelect: (movie: Movie) => void;
}

export function MovieDetails({
  movie,
  onClose,
  onUpdate,
  isInWatchlist,
  similarMovies,
  onMovieSelect,
}: MovieDetailsProps) {
  const { user } = useAuth();
  const [userRating, setUserRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUserRating();
  }, [movie.id]);

  const loadUserRating = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('ratings')
      .select('rating, review')
      .eq('user_id', user.id)
      .eq('movie_id', movie.id)
      .maybeSingle();

    if (data) {
      setUserRating(data.rating);
      setReview(data.review || '');
    } else {
      setUserRating(0);
      setReview('');
    }
  };

  const handleRatingSubmit = async () => {
    if (!user || userRating === 0) return;

    setLoading(true);
    try {
      const { error } = await supabase.from('ratings').upsert({
        user_id: user.id,
        movie_id: movie.id,
        rating: userRating,
        review: review,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;
      onUpdate();
    } catch (error) {
      console.error('Error saving rating:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWatchlistToggle = async () => {
    if (!user) return;

    try {
      if (isInWatchlist) {
        await supabase
          .from('watchlist')
          .delete()
          .eq('user_id', user.id)
          .eq('movie_id', movie.id);
      } else {
        await supabase.from('watchlist').insert({
          user_id: user.id,
          movie_id: movie.id,
        });
      }
      onUpdate();
    } catch (error) {
      console.error('Error updating watchlist:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen px-4 py-8 flex items-start justify-center">
        <div className="bg-slate-800 rounded-lg max-w-4xl w-full border border-slate-700 shadow-2xl">
          <div className="relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-slate-900/80 backdrop-blur-sm rounded-full hover:bg-slate-900 transition-colors"
              aria-label="Close Movie Details"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <div className="grid md:grid-cols-[300px,1fr] gap-6 p-6">
              <div>
                <img
                  src={movie.poster_url}
                  alt={movie.title}
                  className="w-full rounded-lg shadow-lg"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">{movie.title}</h2>
                  <p className="text-slate-400 text-lg">{movie.year}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="text-white font-medium text-lg">
                      {movie.average_rating > 0 ? movie.average_rating.toFixed(1) : 'N/A'}
                    </span>
                    <span className="text-slate-400">({movie.rating_count} ratings)</span>
                  </div>

                  <button
                    onClick={handleWatchlistToggle}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                  >
                    {isInWatchlist ? (
                      <>
                        <BookmarkCheck className="w-5 h-5 text-blue-400" />
                        <span className="text-white">In Watchlist</span>
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-5 h-5 text-white" />
                        <span className="text-white">Add to Watchlist</span>
                      </>
                    )}
                  </button>
                </div>

                <div>
                  <h3 className="text-white font-semibold mb-2">Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.map((genre) => (
                      <span
                        key={genre}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-white font-semibold mb-2">Director</h3>
                  <p className="text-slate-300">{movie.director}</p>
                </div>

                <div>
                  <h3 className="text-white font-semibold mb-2">Cast</h3>
                  <p className="text-slate-300">{movie.cast_members.join(', ')}</p>
                </div>

                <div>
                  <h3 className="text-white font-semibold mb-2">Synopsis</h3>
                  <p className="text-slate-300 leading-relaxed">{movie.description}</p>
                </div>

                <div className="border-t border-slate-700 pt-4">
                  <h3 className="text-white font-semibold mb-3">Your Rating</h3>
                  <div className="flex items-center gap-2 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setUserRating(star)}
                        className="transition-transform hover:scale-110"
                        aria-label="Rate {star} stars"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= (hoverRating || userRating)
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-slate-600'
                          }`}
                        />
                      </button>
                    ))}
                    {userRating > 0 && (
                      <span className="text-white ml-2">{userRating}/5</span>
                    )}
                  </div>

                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Write a review (optional)..."
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                    rows={3}
                  />

                  <button
                    onClick={handleRatingSubmit}
                    disabled={loading || userRating === 0}
                    className="mt-3 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                  >
                    {loading ? 'Saving...' : 'Submit Rating'}
                  </button>
                </div>
              </div>
            </div>

            {similarMovies.length > 0 && (
              <div className="border-t border-slate-700 p-6">
                <h3 className="text-white font-semibold text-xl mb-4">Similar Movies</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {similarMovies.map((similar) => (
                    <MovieCard
                      key={similar.id}
                      movie={similar}
                      onClick={() => onMovieSelect(similar)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
