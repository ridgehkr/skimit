import { fetchRedditPosts, fetchSubredditInfo } from '@/lib/reddit'
import type { RedditPost, SortBy, SubredditInfo } from '@/types/reddit'

export const fetchPosts = async (
  subreddit: string,
  sortBy: SortBy,
  after?: string,
  subredditInfo?: SubredditInfo | null
): Promise<[RedditPost[], SubredditInfo | null, string | null]> => {
  const [postsData, info] = await Promise.all([
    fetchRedditPosts(subreddit, sortBy, after),
    !after ? fetchSubredditInfo(subreddit) : Promise.resolve(subredditInfo),
  ])

  return [postsData.posts, info, postsData.after]
}
