import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import * as api from '../lib/api';

interface User {
  id: string;
  email: string;
  username: string;
  favoriteGenres: string[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (username?: string, favoriteGenres?: string[]) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const profile = await api.getProfile();
      setUser({
        id: profile.id,
        email: profile.email,
        username: profile.username,
        favoriteGenres: profile.favoriteGenres || [],
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      setUser(null);
    }
  };

  useEffect(() => {
    const token = api.getAuthToken();
    if (token) {
      fetchProfile().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const signUp = async (email: string, password: string, username: string) => {
    const userData = await api.register(email, password, username);
    setUser({
      id: userData.id,
      email: userData.email,
      username: userData.username,
      favoriteGenres: userData.favoriteGenres || [],
    });
  };

  const signIn = async (email: string, password: string) => {
    const userData = await api.login(email, password);
    setUser({
      id: userData.id,
      email: userData.email,
      username: userData.username,
      favoriteGenres: userData.favoriteGenres || [],
    });
  };

  const signOut = async () => {
    api.clearAuthToken();
    setUser(null);
  };

  const updateProfile = async (username?: string, favoriteGenres?: string[]) => {
    const updated = await api.updateProfile(username, favoriteGenres);
    setUser({
      id: updated.id,
      email: updated.email,
      username: updated.username,
      favoriteGenres: updated.favoriteGenres || [],
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
