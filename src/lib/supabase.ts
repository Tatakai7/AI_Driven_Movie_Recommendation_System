import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          favorite_genres: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          favorite_genres?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          favorite_genres?: string[];
          updated_at?: string;
        };
      };
      movies: {
        Row: {
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
          created_at: string;
        };
      };
      ratings: {
        Row: {
          id: string;
          user_id: string;
          movie_id: string;
          rating: number;
          review: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          movie_id: string;
          rating: number;
          review?: string;
        };
        Update: {
          rating?: number;
          review?: string;
          updated_at?: string;
        };
      };
      watchlist: {
        Row: {
          id: string;
          user_id: string;
          movie_id: string;
          added_at: string;
        };
        Insert: {
          user_id: string;
          movie_id: string;
        };
      };
      user_preferences: {
        Row: {
          id: string;
          user_id: string;
          preference_vector: Record<string, number>;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          preference_vector?: Record<string, number>;
        };
        Update: {
          preference_vector?: Record<string, number>;
          updated_at?: string;
        };
      };
    };
  };
};
