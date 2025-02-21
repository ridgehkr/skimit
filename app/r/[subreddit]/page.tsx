import SubredditPageClient from './subreddit-page-client'

interface SubredditPageProps {
  params: { subreddit: string }
}

export default function SubredditPage({ params }: SubredditPageProps) {
  return <SubredditPageClient subreddit={params.subreddit} />
}
