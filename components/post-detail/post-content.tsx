'use client'

import { RedditPost } from '@/types/reddit'
import { CardContent } from '@/components/ui/card'
import { PostActions } from '@/components/post-detail/post-actions'
import { MarkdownContent } from '@/components/markdown-content'
import { useRedditAuth } from '@/lib/auth/reddit-auth'

interface PostContentProps {
  post: RedditPost
}

export function PostContent({ post }: PostContentProps) {
  const { isAuthenticated } = useRedditAuth()

  if (!isAuthenticated && !post.selftext) return null

  return (
    <CardContent className='space-y-4'>
      {isAuthenticated && <PostActions score={post.score} postId={post.id} />}
      {post.selftext && <MarkdownContent content={post.selftext} />}
    </CardContent>
  )
}
