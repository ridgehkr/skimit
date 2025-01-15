"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { subredditStorage } from '@/lib/subreddits';
import { refreshToken } from './reddit-oauth';

interface AuthError {
  message: string;
  code: string;
}

interface RedditAuthState {
  accessToken: string | null;
  refreshToken: string | null;
  username: string | null;
  isAuthenticated: boolean;
  error: AuthError | null;
  login: (accessToken: string, refreshToken: string, username: string) => void;
  logout: () => void;
  setError: (error: AuthError | null) => void;
  refreshAccessToken: () => Promise<string | null>;
}

export const useRedditAuth = create<RedditAuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      username: null,
      isAuthenticated: false,
      error: null,
      login: (accessToken: string, refreshToken: string, username: string) => {
        set({ 
          accessToken, 
          refreshToken,
          username, 
          isAuthenticated: true,
          error: null
        });
        // Load user's subreddits when they log in
        subredditStorage.loadUserSubreddits(username);
      },
      logout: () => {
        set({ 
          accessToken: null,
          refreshToken: null,
          username: null, 
          isAuthenticated: false,
          error: null
        });
        // Clear subreddits when user logs out
        subredditStorage.clear();
      },
      setError: (error) => set({ error }),
      refreshAccessToken: async () => {
        const state = get();
        if (!state.refreshToken) return null;

        try {
          const { access_token } = await refreshToken(state.refreshToken);
          set({ accessToken: access_token });
          return access_token;
        } catch (error) {
          console.error('Failed to refresh token:', error);
          // If refresh fails, log the user out
          get().logout();
          return null;
        }
      }
    }),
    {
      name: 'reddit-auth-storage',
    }
  )
);