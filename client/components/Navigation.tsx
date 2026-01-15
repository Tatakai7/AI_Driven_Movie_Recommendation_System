import { Film, Home, Sparkles, Bookmark, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export function Navigation({ currentView, onViewChange }: NavigationProps) {
  const { profile, signOut } = useAuth();

  return (
    <nav className="bg-slate-800 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <Film className="w-8 h-8 text-blue-500" />
              <span className="text-xl font-bold text-white">CineMatch AI</span>
            </div>

            <div className="hidden md:flex items-center gap-1">
              <button
                onClick={() => onViewChange('browse')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'browse'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Browse</span>
              </button>

              <button
                onClick={() => onViewChange('recommendations')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'recommendations'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>For You</span>
              </button>

              <button
                onClick={() => onViewChange('watchlist')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'watchlist'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                <span>Watchlist</span>
              </button>

              <button
                onClick={() => onViewChange('profile')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'profile'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-slate-300 hidden sm:block">
              Hello, <span className="font-semibold text-white">{profile?.username}</span>
            </span>
            <button
              onClick={signOut}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        <div className="md:hidden flex gap-1 pb-2 overflow-x-auto">
          <button
            onClick={() => onViewChange('browse')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
              currentView === 'browse'
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 bg-slate-700'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Browse</span>
          </button>

          <button
            onClick={() => onViewChange('recommendations')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
              currentView === 'recommendations'
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 bg-slate-700'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>For You</span>
          </button>

          <button
            onClick={() => onViewChange('watchlist')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
              currentView === 'watchlist'
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 bg-slate-700'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Watchlist</span>
          </button>

          <button
            onClick={() => onViewChange('profile')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
              currentView === 'profile'
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 bg-slate-700'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
