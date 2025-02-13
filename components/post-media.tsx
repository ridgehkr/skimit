'use client'

import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'
import { RedditPost } from '@/types/reddit'
import Image from 'next/image'

interface PostMediaProps {
  post: RedditPost
}

export function PostMedia({ post }: PostMediaProps) {
  const isImagePost = post.url.match(/\.(jpeg|jpg|gif|png)$/i)
  const isVideoPost = post.is_video
  const isLinkPost = post.url && !post.selftext && !isImagePost && !isVideoPost

  if (isImagePost) {
    return (
      <a
        href={post.url}
        target='_blank'
        rel='noopener noreferrer'
        className='block rounded-lg overflow-hidden hover:opacity-95 transition-opacity w-full max-w-[800px] mx-auto'
      >
        <Image src={post.url} alt={post.title} className='w-full h-auto' />
      </a>
    )
  }

  if (isVideoPost && post.media?.reddit_video) {
    return (
      <div className='rounded-lg overflow-hidden max-w-[800px] mx-auto'>
        <video
          controls
          src={post.media.reddit_video.fallback_url}
          className='w-full h-auto'
        />
      </div>
    )
  }

  if (isLinkPost) {
    return (
      <div className='mb-4'>
        <Button variant='outline' className='gap-2' asChild>
          <a href={post.url} target='_blank' rel='noopener noreferrer'>
            <ExternalLink className='h-4 w-4' />
            Visit Link
          </a>
        </Button>
      </div>
    )
  }

  return null
}
