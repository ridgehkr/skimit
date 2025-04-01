'use client'

import { redirect } from 'next/navigation'
import { useSubredditStore } from '@/store/subreddits'

export default function Home() {
  const { getTopSubreddit } = useSubredditStore()

  const top = getTopSubreddit()?.name ?? 'all'

  // redirect to the top subreddit, if any have been saved
  return redirect(`/r/${top}`)
}
