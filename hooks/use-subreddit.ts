import type { SortBy } from '@/types/reddit'
import { useInfiniteQuery } from '@tanstack/react-query'
import {
  fetchRedditPosts,
  DEFAULT_SUBREDDIT_SORT,
  DEFAULT_NSFW_ALLOWED,
} from '@/lib/reddit'
import { queryKeys } from '@/lib/query-keys'

interface UseSubredditParams {
  sortBy?: SortBy
  allowNSFW?: boolean
}

const useSubreddit = (
  subreddit: string,
  {
    sortBy = DEFAULT_SUBREDDIT_SORT,
    allowNSFW = DEFAULT_NSFW_ALLOWED,
  }: UseSubredditParams = {}
) => {
  const { data, error, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: queryKeys.posts(subreddit, sortBy),
      queryFn: ({ pageParam }: { pageParam?: string }) =>
        fetchRedditPosts(subreddit, sortBy, pageParam),
      getNextPageParam: (lastPage) => lastPage?.after ?? null,
      initialPageParam: undefined,
    })

  const posts = (data?.pages.flatMap((page) => page.posts) ?? []).filter(
    (post) => !post.over_18 || allowNSFW
  )

  return { posts, error, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage }
}

export { useSubreddit }
