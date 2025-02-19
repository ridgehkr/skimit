'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { fetchRedditPost } from '@/lib/reddit'
import { RedditPost } from '@/types/reddit'
import { formatRedditDate } from '@/lib/utils/reddit-date'
import { MessageCircle, ArrowUpIcon, ArrowDownIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PostMedia } from '@/components/post-media'

export function PostContent({ id }: { id: string }) {
  const [post, setPost] = useState<RedditPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPost = async () => {
      try {
        const postData = await fetchRedditPost(id)
        setPost(postData)
      } catch (error) {
        console.error('Error loading post:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPost()
  }, [id])

  if (loading) {
    return <div className='container py-8'>Loading...</div>
  }

  if (!post) {
    return <div className='container py-8'>Post not found</div>
  }

  return (
    <div className='container py-8'>
      <Card>
        <CardHeader>
          <h1 className='text-2xl font-bold'>{post.title}</h1>
          <div className='flex items-center gap-4 text-sm text-muted-foreground'>
            <span>Posted by u/{post.author}</span>
            <span>{formatRedditDate(post.created_utc)}</span>
            <div className='flex items-center gap-1'>
              <MessageCircle className='h-4 w-4' />
              {post.num_comments} comments
            </div>
          </div>
        </CardHeader>
        <CardContent className='space-y-4'>
          <PostMedia post={post} />

          <div className='flex items-center gap-2'>
            <Button variant='ghost' size='icon'>
              <ArrowUpIcon className='h-5 w-5' />
            </Button>
            <span className='font-medium'>{post.score}</span>
            <Button variant='ghost' size='icon'>
              <ArrowDownIcon className='h-5 w-5' />
            </Button>
          </div>

          {post.selftext && (
            <div className='prose dark:prose-invert max-w-none'>
              {post.selftext}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
