import { useEffect, useState } from 'react'
import type { RedditPost, SubredditInfo, SortBy } from '@/types/reddit'
import { useInfiniteQuery } from '@tanstack/react-query'
import {
  fetchRedditPosts,
  fetchSubredditInfo,
  DEFAULT_SUBREDDIT_SORT,
  DEFAULT_NSFW_ALLOWED,
} from '@/lib/reddit'

interface FetchPostsParams {
  subreddit: string
  sortBy: SortBy
  after?: string
  subredditInfo?: SubredditInfo | null
  allowNSFW?: boolean
}

interface UseSubredditExtraParams {
  sortBy: SortBy
  allowNSFW: boolean
}

/**
 * The Reddit post-fetching query for TanStack Query
 *
 * @returns A tuple containing:
 * - An array of Reddit posts
 * - Subreddit info (if available)
 * - The `after` value for pagination (if available)
 */
const fetchPosts = async ({
  subreddit,
  sortBy,
  after = undefined,
  subredditInfo = null,
  allowNSFW = false,
}: FetchPostsParams): Promise<
  [RedditPost[], SubredditInfo | null, string | null]
> => {
  const [postsData, info] = await Promise.all([
    fetchRedditPosts(subreddit, sortBy, after),
    !after ? fetchSubredditInfo(subreddit) : Promise.resolve(subredditInfo),
  ])

  const posts = postsData.posts.filter((post) => !post.over_18 || allowNSFW)

  return [posts, info ?? null, postsData.after]
}

/**
 * Handles fetching Reddit posts and subreddit info for a given subreddit.
 *
 * @param {string} subreddit - The subreddit to fetch posts from
 * @param {UseSubredditExtraParams} params - Extra parameters for fetching posts
 *    @param {SortBy} params.sortBy - The sorting method for posts (default: 'hot')
 *    @param {boolean} params.allowNSFW - Whether to allow NSFW posts (default: true)
 * @returns - An object containing:
 * - An array of Reddit posts
 * - Subreddit info (if available)
 * - An error object (if any)
 * - Loading state (boolean)
 * - Fetching next page state (boolean)
 * - Function to fetch the next page of posts
 * - Boolean indicating if there are more pages to fetch
 */
const useSubreddit = (
  subreddit: string,
  {
    sortBy = DEFAULT_SUBREDDIT_SORT,
    allowNSFW = DEFAULT_NSFW_ALLOWED,
  }: UseSubredditExtraParams
) => {
  const [posts, setPosts] = useState<RedditPost[]>([])
  const [subredditInfo, setSubredditInfo] = useState<SubredditInfo | null>(null)

  // Load Reddit posts for this page's subreddit (infinite loading enabled)
  const {
    data,
    error,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['posts', subreddit, sortBy],
    queryFn: ({ pageParam = undefined }: { pageParam?: string }) =>
      fetchPosts({ subreddit, sortBy, allowNSFW, after: pageParam }),
    getNextPageParam: (lastPage) => lastPage?.[2] || null, // `after` value for pagination
    initialPageParam: undefined,
  })

  useEffect(() => {
    setPosts(data?.pages.flatMap((page) => page[0]) || [])
    setSubredditInfo(data?.pages[0]?.[1] || null)
  }, [data])

  return {
    posts,
    subredditInfo,
    error,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  }
}

export { useSubreddit }
