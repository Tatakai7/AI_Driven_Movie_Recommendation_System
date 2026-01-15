import { useState, useEffect } from 'react';
import { User, Heart, Star, Film } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

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

export function Profile() {
  const { user, profile, refreshProfile } = useAuth();
  const [favoriteGenres, setFavoriteGenres] = useState<string[]>([]);
  const [stats, setStats] = useState({
    totalRatings: 0,
    averageRating: 0,
    watchlistCount: 0,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFavoriteGenres(profile.favorite_genres || []);
      loadStats();
    }
  }, [profile]);

  const loadStats = async () => {
    if (!user) return;

    const [ratingsResponse, watchlistResponse] = await Promise.all([
      supabase.from('ratings').select('rating').eq('user_id', user.id),
      supabase.from('watchlist').select('id').eq('user_id', user.id),
    ]);

    const ratings = ratingsResponse.data || [];
    const avgRating = ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
      : 0;

    setStats({
      totalRatings: ratings.length,
      averageRating: avgRating,
      watchlistCount: watchlistResponse.data?.length || 0,
    });
  };

  const toggleGenre = (genre: string) => {
    setFavoriteGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      await supabase
        .from('profiles')
        .update({
          favorite_genres: favoriteGenres,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      await refreshProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{profile?.username}</h1>
              <p className="text-slate-400">{user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-700">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="text-2xl font-bold text-white">{stats.totalRatings}</span>
              </div>
              <p className="text-slate-400 text-sm">Ratings</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Film className="w-5 h-5 text-blue-500" />
                <span className="text-2xl font-bold text-white">{stats.watchlistCount}</span>
              </div>
              <p className="text-slate-400 text-sm">Watchlist</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Heart className="w-5 h-5 text-red-500" />
                <span className="text-2xl font-bold text-white">
                  {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : 'N/A'}
                </span>
              </div>
              <p className="text-slate-400 text-sm">Avg Rating</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg border border-slate-700 p-8">
          <h2 className="text-xl font-bold text-white mb-4">Favorite Genres</h2>
          <p className="text-slate-400 mb-6">
            Select your favorite genres to get better movie recommendations
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            {GENRES.map((genre) => (
              <button
                key={genre}
                onClick={() => toggleGenre(genre)}
                className={`px-4 py-3 rounded-lg border-2 transition-all ${
                  favoriteGenres.includes(genre)
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-slate-600 bg-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            {saving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </div>
    </div>
  );
}
