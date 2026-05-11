'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchRedditPost, fetchComments } from '@/lib/reddit'
import { queryKeys } from '@/lib/query-keys'
import type { RedditPost, RedditComment, CommentSortBy } from '@/types/reddit'

export function usePost(postId: string) {
  return useQuery<RedditPost>({
    queryKey: queryKeys.post(postId),
    queryFn: () => fetchRedditPost(postId),
    enabled: !!postId,
  })
}

export function usePostComments(postId: string, sort: CommentSortBy) {
  return useQuery<RedditComment[]>({
    queryKey: queryKeys.comments(postId, sort),
    queryFn: () => fetchComments(postId, sort),
    enabled: !!postId,
  })
}
