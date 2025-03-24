'use client'

import { redirect } from 'next/navigation'
import { useSubredditStore } from '@/store/subreddits'
import { useTheme } from 'next-themes'

export default function Home() {
  const { hydrated, getTopSubreddit } = useSubredditStore()

  // wait for the store to hydrate before checking for saved subreddits
  if (!hydrated) {
    return null
  }

  const top = getTopSubreddit()?.name ?? 'all'

  // redirect to the top subreddit, if any have been saved
  return redirect(`/r/${top}`)
}
