import PostPageClient from './post-page-client'

export interface SubredditPostProps {
  postId: string
  subreddit: string
}

export default async function PostPage({
  params,
}: {
  params: SubredditPostProps
}) {
  const { postId, subreddit } = await params

  return <PostPageClient postId={postId} subreddit={subreddit} />
}
