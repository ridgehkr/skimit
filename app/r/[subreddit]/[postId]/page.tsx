'use client';

import PostPageClient from './post-page-client'

export default function PostPage({ params }: { params: { subreddit: string; postId: string } }) {
  return <PostPageClient params={params} />
}