'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchSubredditInfo } from '@/lib/reddit'
import { queryKeys } from '@/lib/query-keys'

export function useSubredditInfo(subreddit: string) {
  return useQuery({
    queryKey: queryKeys.subredditInfo(subreddit),
    queryFn: () => fetchSubredditInfo(subreddit),
    enabled: !!subreddit,
    staleTime: 5 * 60_000,
  })
}
