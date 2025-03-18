import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

export interface SavedSubreddit {
  name: string
  isFavorite: boolean
  order: number
  iconUrl?: string
}

interface SubredditStoreState {
  hydrated: boolean
  subreddits: SavedSubreddit[]
  allowNSFW: boolean
}

interface SubredditStoreActions {
  setAllowNSFW: (allow: boolean) => void
  setHydrated: () => void
  addSubreddit: (
    subreddit: Omit<SavedSubreddit, 'order' | 'isFavorite'>
  ) => void
  removeSubreddit: (name: string) => void
  addFavorite: (name: string) => void
  removeFavorite: (name: string) => void
  setSubreddits: (subreddits: SavedSubreddit[]) => void
  toggleFavorite: (name: string) => void
  sort: () => void
  getTopSubreddit: () => SavedSubreddit | undefined
}

export type SubredditStore = SubredditStoreState & SubredditStoreActions

export const useSubredditStore = create<SubredditStore>()(
  persist(
    immer((set, get) => ({
      // A flag to know when hydration is done
      hydrated: false,

      // all saved subreddits
      subreddits: [],

      // allow NSFW content
      allowNSFW: false,

      // Whether to allow NSFW content
      setAllowNSFW: (allow: boolean) =>
        set((state) => {
          state.allowNSFW = allow
        }),

      // Set the hydrated flag to true. Called after the persisted state is retrieved; used to prevent hydration mismatch
      setHydrated: () =>
        set((state) => {
          state.hydrated = true
        }),

      // add a subreddit to the list
      addSubreddit: (
        subreddit: Omit<SavedSubreddit, 'order' | 'isFavorite'>
      ) => {
        const { subreddits } = get()

        // Prevent duplicates
        if (subreddits.some((s) => s.name === subreddit.name)) return

        set((state) => {
          state.subreddits.push({
            ...subreddit,
            order: state.subreddits.length,
            isFavorite: false,
          })
        })
      },

      // remove a subreddit from the list
      removeSubreddit: (name: string) =>
        set((state) => {
          state.subreddits = state.subreddits.filter(
            (subreddit) => subreddit.name !== name
          )
        }),

      // add a subreddit to favorites
      addFavorite: (name: string) =>
        set((state) => {
          const subreddit = state.subreddits.find(
            (subreddit) => subreddit.name === name
          )
          if (subreddit) {
            subreddit.isFavorite = true
          }
        }),

      // remove a subreddit from favorites
      removeFavorite: (name: string) =>
        set((state) => {
          const subreddit = state.subreddits.find(
            (subreddit) => subreddit.name === name
          )
          if (subreddit) {
            subreddit.isFavorite = false
          }
        }),

      // toggle the "favorite" status of a subreddit
      toggleFavorite: (name: string) =>
        set((state) => {
          const subreddit = state.subreddits.find(
            (subreddit) => subreddit.name === name
          )
          if (subreddit) {
            subreddit.isFavorite = !subreddit.isFavorite
          }
        }),

      // set the list of subreddits
      setSubreddits: (subreddits: SavedSubreddit[]) =>
        set((state) => {
          state.subreddits = subreddits
        }),

      // sort subreddits by name, ascending
      sort: () =>
        set((state) => {
          state.subreddits.sort((a, b) => a.name.localeCompare(b.name))
        }),

      // get the "top" subreddit, which is 1st in the list of favorites, or the first non-favorite, or undefined
      getTopSubreddit: () => {
        const { subreddits } = get()
        return (
          subreddits.find((s) => s.isFavorite) ||
          subreddits.find((s) => !s.isFavorite) ||
          undefined
        )
      },
    })),
    {
      name: 'skimit__subreddit-storage',

      // onRehydrateStorage is called after the persisted state is retrieved
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('Rehydration error:', error)
        } else {
          state?.setHydrated()
        }
      },
    }
  )
)
