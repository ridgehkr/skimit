export const queryKeys = {
  posts: (subreddit: string, sortBy: string) =>
    ['posts', subreddit, sortBy] as const,
  post: (postId: string) => ['post', postId] as const,
  comments: (postId: string, sort: string) =>
    ['comments', postId, sort] as const,
  subredditInfo: (subreddit: string) =>
    ['subreddit-info', subreddit] as const,
  subredditSuggestions: (query: string) =>
    ['subreddit-suggestions', query] as const,
} as const
