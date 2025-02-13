'use client';

import SubredditPageClient from './subreddit-page-client'

export default function SubredditPage({ params }: { params: { subreddit: string } }) {
  return <SubredditPageClient params={params} />
}