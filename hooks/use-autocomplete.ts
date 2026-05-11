'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchAutocompleteSuggestions } from '@/lib/reddit'
import { queryKeys } from '@/lib/query-keys'
import type { SavedSubreddit } from '@/store/subreddits'

export function useAutocompleteSuggestions(
  query: string,
  savedSubreddits: SavedSubreddit[],
  limit = 10,
  allowNSFW = false
) {
  return useQuery({
    queryKey: queryKeys.subredditSuggestions(query),
    queryFn: async () => {
      const results = await fetchAutocompleteSuggestions(query, allowNSFW)
      return results
        .filter(
          (s) =>
            !savedSubreddits.some(
              (saved) => saved.name?.toLowerCase() === s.name?.toLowerCase()
            )
        )
        .slice(0, limit)
    },
    enabled: !!query,
    staleTime: 30_000,
  })
}
