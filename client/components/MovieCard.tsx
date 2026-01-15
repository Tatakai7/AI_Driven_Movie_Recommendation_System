import { Star, Bookmark, BookmarkCheck } from 'lucide-react';

interface Movie {
  id: string;
  title: string;
  description: string;
  genres: string[];
  year: number;
  poster_url: string;
  director: string;
  average_rating: number;
  rating_count: number;
}

interface MovieCardProps {
  movie: Movie;
  isInWatchlist?: boolean;
  onToggleWatchlist?: () => void;
  onClick: () => void;
}

export function MovieCard({ movie, isInWatchlist, onToggleWatchlist, onClick }: MovieCardProps) {
  const handleWatchlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWatchlist?.();
  };

  return (
    <div
      onClick={onClick}
      className="group bg-slate-800 rounded-lg overflow-hidden border border-slate-700 hover:border-blue-500 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-blue-500/20 hover:-translate-y-1"
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-slate-700">
        <img
          src={movie.poster_url}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {onToggleWatchlist && (
          <button
            onClick={handleWatchlistClick}
            className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/80 backdrop-blur-sm hover:bg-blue-600 transition-colors"
          >
            {isInWatchlist ? (
              <BookmarkCheck className="w-5 h-5 text-blue-400" />
            ) : (
              <Bookmark className="w-5 h-5 text-white" />
            )}
          </button>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-1 line-clamp-1 group-hover:text-blue-400 transition-colors">
          {movie.title}
        </h3>

        <p className="text-slate-400 text-sm mb-2">{movie.year}</p>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-white font-medium">
              {movie.average_rating > 0 ? movie.average_rating.toFixed(1) : 'N/A'}
            </span>
          </div>
          {movie.rating_count > 0 && (
            <span className="text-slate-400 text-sm">({movie.rating_count})</span>
          )}
        </div>

        <div className="flex flex-wrap gap-1">
          {movie.genres.slice(0, 3).map((genre) => (
            <span
              key={genre}
              className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-full"
            >
              {genre}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
