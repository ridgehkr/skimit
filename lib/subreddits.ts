import Cookies from 'js-cookie';

export interface SavedSubreddit {
  name: string;
  lastVisited: number;
  isFavorite: boolean;
  order?: number;
  iconUrl?: string;
}

const SUBREDDITS_COOKIE_PREFIX = 'savedSubreddits';
const SORT_ORDER_COOKIE_PREFIX = 'subredditSortOrder';
const ANONYMOUS_KEY = 'anonymous';

const COOKIE_OPTIONS = {
  expires: 365,
  sameSite: 'strict' as const,
  secure: process.env.NODE_ENV === 'production'
};

export const subredditStorage = {
  getCookieKey: (prefix: string) => {
    const authStorage = localStorage.getItem('reddit-auth-storage');
    const username = authStorage ? JSON.parse(authStorage)?.state?.username : null;
    return username ? `${prefix}_${username}` : `${prefix}_${ANONYMOUS_KEY}`;
  },

  getSaved: (): SavedSubreddit[] => {
    const saved = Cookies.get(subredditStorage.getCookieKey(SUBREDDITS_COOKIE_PREFIX));
    const sortOrder = Cookies.get(subredditStorage.getCookieKey(SORT_ORDER_COOKIE_PREFIX));
    
    let subreddits = saved ? JSON.parse(saved) : [];
    const order = sortOrder ? JSON.parse(sortOrder) : {};
    
    // Apply order to subreddits
    subreddits = subreddits.map((sub: SavedSubreddit) => ({
      ...sub,
      order: order[sub.name] ?? Number.MAX_SAFE_INTEGER
    }));
    
    // Sort by order first, then by lastVisited
    return subreddits.sort((a: SavedSubreddit, b: SavedSubreddit) => {
      // First sort by favorite status
      if (a.isFavorite !== b.isFavorite) {
        return b.isFavorite ? 1 : -1;
      }
      // Then sort by order
      if (a.order !== b.order) {
        return (a.order ?? 0) - (b.order ?? 0);
      }
      // Finally sort by last visited
      return b.lastVisited - a.lastVisited;
    });
  },
  
  save: (subreddit: string, iconUrl?: string) => {
    const saved = subredditStorage.getSaved();
    const existingIndex = saved.findIndex(s => s.name === subreddit);
    
    if (existingIndex === -1) {
      // Add new subreddit
      saved.push({
        name: subreddit,
        lastVisited: Date.now(),
        isFavorite: false,
        order: saved.length,
        iconUrl
      });
    } else {
      // Update existing subreddit
      saved[existingIndex] = {
        ...saved[existingIndex],
        lastVisited: Date.now(),
        iconUrl: iconUrl || saved[existingIndex].iconUrl
      };
    }
    
    // Save both the subreddits and their order
    const order = saved.reduce((acc, sub, index) => ({
      ...acc,
      [sub.name]: sub.order ?? index
    }), {});
    
    Cookies.set(
      subredditStorage.getCookieKey(SUBREDDITS_COOKIE_PREFIX),
      JSON.stringify(saved),
      COOKIE_OPTIONS
    );
    
    Cookies.set(
      subredditStorage.getCookieKey(SORT_ORDER_COOKIE_PREFIX),
      JSON.stringify(order),
      COOKIE_OPTIONS
    );
  },
  
  remove: (subreddit: string) => {
    const saved = subredditStorage.getSaved();
    const filtered = saved.filter(s => s.name !== subreddit);
    
    // Reorder remaining items
    const reordered = filtered.map((sub, index) => ({
      ...sub,
      order: index
    }));
    
    // Update both cookies
    Cookies.set(
      subredditStorage.getCookieKey(SUBREDDITS_COOKIE_PREFIX),
      JSON.stringify(reordered),
      COOKIE_OPTIONS
    );
    
    const order = reordered.reduce((acc, sub, index) => ({
      ...acc,
      [sub.name]: index
    }), {});
    
    Cookies.set(
      subredditStorage.getCookieKey(SORT_ORDER_COOKIE_PREFIX),
      JSON.stringify(order),
      COOKIE_OPTIONS
    );
  },

  updateOrder: (items: SavedSubreddit[]) => {
    // Create new order object with updated indices
    const order = items.reduce((acc, item, index) => ({
      ...acc,
      [item.name]: index
    }), {});
    
    // Update items with new order
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index
    }));
    
    // Save both cookies
    Cookies.set(
      subredditStorage.getCookieKey(SORT_ORDER_COOKIE_PREFIX),
      JSON.stringify(order),
      COOKIE_OPTIONS
    );
    
    Cookies.set(
      subredditStorage.getCookieKey(SUBREDDITS_COOKIE_PREFIX),
      JSON.stringify(updatedItems),
      COOKIE_OPTIONS
    );
  },

  clear: () => {
    Cookies.remove(subredditStorage.getCookieKey(SUBREDDITS_COOKIE_PREFIX));
    Cookies.remove(subredditStorage.getCookieKey(SORT_ORDER_COOKIE_PREFIX));
  },

  loadUserSubreddits: (username: string) => {
    // Transfer anonymous subreddits to user account if they exist
    const anonymousSaved = Cookies.get(`${SUBREDDITS_COOKIE_PREFIX}_${ANONYMOUS_KEY}`);
    const anonymousOrder = Cookies.get(`${SORT_ORDER_COOKIE_PREFIX}_${ANONYMOUS_KEY}`);
    
    if (anonymousSaved) {
      Cookies.set(
        `${SUBREDDITS_COOKIE_PREFIX}_${username}`,
        anonymousSaved,
        COOKIE_OPTIONS
      );
    }
    
    if (anonymousOrder) {
      Cookies.set(
        `${SORT_ORDER_COOKIE_PREFIX}_${username}`,
        anonymousOrder,
        COOKIE_OPTIONS
      );
    }
    
    // Clear anonymous data after transfer
    Cookies.remove(`${SUBREDDITS_COOKIE_PREFIX}_${ANONYMOUS_KEY}`);
    Cookies.remove(`${SORT_ORDER_COOKIE_PREFIX}_${ANONYMOUS_KEY}`);
  }
};