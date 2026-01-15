import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Auth } from './components/Auth';
import { Navigation } from './components/Navigation';
import { Browse } from './views/Browse';
import { Recommendations } from './views/Recommendations';
import { Watchlist } from './views/Watchlist';
import { Profile } from './views/Profile';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState('browse');

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      {currentView === 'browse' && <Browse />}
      {currentView === 'recommendations' && <Recommendations />}
      {currentView === 'watchlist' && <Watchlist />}
      {currentView === 'profile' && <Profile />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
