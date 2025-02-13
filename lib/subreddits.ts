import Cookies from 'js-cookie';

export interface SavedSubreddit {
  name: string;
  lastVisited: number;
  isFavorite: boolean;
  order: number;
  iconUrl?: string;
}

const SUBREDDITS_COOKIE_PREFIX = 'savedSubreddits';
const ANONYMOUS_KEY = 'anonymous';

const COOKIE_OPTIONS = {
  expires: 365,
  sameSite: 'strict' as const,
  secure: process.env.NODE_ENV === 'production'
};

const getUsername = () => {
  if (typeof window === 'undefined') return null;
  try {
    const authStorage = localStorage.getItem('reddit-auth-storage');
    return authStorage ? JSON.parse(authStorage)?.state?.username : null;
  } catch (e) {
    console.error('Error reading auth storage:', e);
    return null;
  }
};

export const subredditStorage = {
  getCookieKey: (prefix: string) => {
    const username = getUsername();
    return username ? `${prefix}_${username}` : `${prefix}_${ANONYMOUS_KEY}`;
  },

  getSubreddits: (): SavedSubreddit[] => {
    if (typeof window === 'undefined') return [];
    
    const subreddits = Cookies.get(subredditStorage.getCookieKey(SUBREDDITS_COOKIE_PREFIX));
    return subreddits ? JSON.parse(subreddits) : [];
  },

  saveSubreddits: (subreddits: SavedSubreddit[]) => {
    if (typeof window === 'undefined') return;
    
    Cookies.set(
      subredditStorage.getCookieKey(SUBREDDITS_COOKIE_PREFIX),
      JSON.stringify(subreddits),
      COOKIE_OPTIONS
    );
  },

  save: (subreddit: string, iconUrl?: string) => {
    const subreddits = subredditStorage.getSubreddits();
    const existingIndex = subreddits.findIndex(s => s.name === subreddit);
    
    if (existingIndex === -1) {
      // Add new subreddit
      subreddits.push({
        name: subreddit,
        lastVisited: Date.now(),
        isFavorite: false,
        order: subreddits.length,
        iconUrl
      });
    } else {
      // Update existing subreddit
      subreddits[existingIndex] = {
        ...subreddits[existingIndex],
        lastVisited: Date.now(),
        iconUrl: iconUrl || subreddits[existingIndex].iconUrl
      };
    }

    subredditStorage.saveSubreddits(subreddits);
  },

  remove: (subredditName: string) => {
    const subreddits = subredditStorage.getSubreddits();
    const filtered = subreddits.filter(s => s.name !== subredditName);
    
    // Reorder remaining subreddits
    filtered.forEach((sub, index) => {
      sub.order = index;
    });

    subredditStorage.saveSubreddits(filtered);
  },

  updateOrder: (subreddits: SavedSubreddit[]) => {
    const updated = subreddits.map((sub, index) => ({
      ...sub,
      order: index
    }));
    subredditStorage.saveSubreddits(updated);
  },

  toggleFavorite: (subredditName: string) => {
    const subreddits = subredditStorage.getSubreddits();
    const subreddit = subreddits.find(s => s.name === subredditName);
    if (subreddit) {
      subreddit.isFavorite = !subreddit.isFavorite;
      subredditStorage.saveSubreddits(subreddits);
    }
  },

  sortAlphabetically: () => {
    const subreddits = subredditStorage.getSubreddits();
    
    // Sort favorites and non-favorites separately
    const favorites = subreddits.filter(s => s.isFavorite).sort((a, b) => a.name.localeCompare(b.name));
    const others = subreddits.filter(s => !s.isFavorite).sort((a, b) => a.name.localeCompare(b.name));
    
    // Update order for both groups
    const sorted = [...favorites, ...others].map((sub, index) => ({
      ...sub,
      order: index
    }));
    
    subredditStorage.saveSubreddits(sorted);
    return sorted;
  },

  clear: () => {
    if (typeof window === 'undefined') return;
    Cookies.remove(subredditStorage.getCookieKey(SUBREDDITS_COOKIE_PREFIX));
  },

  loadUserSubreddits: (username: string) => {
    if (typeof window === 'undefined') return;
    
    // Transfer anonymous data to user account if it exists
    const anonymousData = Cookies.get(`${SUBREDDITS_COOKIE_PREFIX}_${ANONYMOUS_KEY}`);
    
    if (anonymousData) {
      Cookies.set(
        `${SUBREDDITS_COOKIE_PREFIX}_${username}`,
        anonymousData,
        COOKIE_OPTIONS
      );
    }
    
    // Clear anonymous data after transfer
    Cookies.remove(`${SUBREDDITS_COOKIE_PREFIX}_${ANONYMOUS_KEY}`);
  }
};