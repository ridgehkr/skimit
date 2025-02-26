'use client'

import { RedditPost } from '@/types/reddit'
import { CardContent } from '@/components/ui/card'
import { MarkdownContent } from '@/components/markdown-content'

interface PostContentProps {
  post: RedditPost
}

export function PostContent({ post }: PostContentProps) {
  return (
    <CardContent className='space-y-4'>
      {post.selftext && <MarkdownContent content={post.selftext} />}
    </CardContent>
  )
}
