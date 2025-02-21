import SubredditPageClient from './subreddit-page-client'

interface SubredditPageProps {
  params: { subreddit: string }
}

export default async function SubredditPage({ params }: SubredditPageProps) {
  const { subreddit } = await params
  return <SubredditPageClient subreddit={subreddit} />
}
