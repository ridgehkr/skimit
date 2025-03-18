'use client'

import { redirect } from 'next/navigation'
import { useSubredditStore } from '@/store/subreddits'

export default function Home() {
  const { hydrated, getTopSubreddit } = useSubredditStore()

  // wait for the store to hydrate before checking for saved subreddits
  if (!hydrated) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <p>Loading…</p>
      </div>
    )
  }

  const top = getTopSubreddit()?.name ?? 'all'

  // redirect to the top subreddit, if any have been saved
  return redirect(`/r/${top}`)
}
