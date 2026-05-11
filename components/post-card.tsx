'use client'

import { RedditPost } from '@/types/reddit'
import { formatRedditDate } from '@/lib/utils/date'
import { getPostType, getThumbnail } from '@/lib/utils/post'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import {
  MessageCircle,
  Image as ImageIcon,
  Link as LinkIcon,
  Video as VideoIcon,
  FileText,
  Images,
} from 'lucide-react'

interface PostCardProps {
  post: RedditPost
}

function getTypeDisplay(post: RedditPost) {
  const type = getPostType(post)
  switch (type) {
    case 'gallery': return { icon: Images, label: 'Gallery' }
    case 'video':   return { icon: VideoIcon, label: 'Video' }
    case 'image':   return { icon: ImageIcon, label: 'Image' }
    case 'text':    return { icon: FileText, label: 'Text' }
    default:        return { icon: LinkIcon, label: 'Link' }
  }
}

export function PostCard({ post }: PostCardProps) {
  const { icon: TypeIcon, label: typeLabel } = getTypeDisplay(post)
  const thumbnail = getThumbnail(post)

  return (
    <Link href={`/r/${post.subreddit}/${post.id}`} className='block'>
      <Card className='hover:bg-accent/50 transition-colors shadow-none dark:shadow-sm'>
        <CardContent className='px-3 py-4'>
          <div className='flex gap-3'>
            {thumbnail && (
              <figure className='relative flex-shrink-0 m-0 w-[80px] h-[80px] rounded-md overflow-hidden bg-muted'>
                <Image
                  src={thumbnail}
                  alt={post.title}
                  width={80}
                  height={80}
                  sizes='80px'
                  className='object-cover h-full w-full'
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </figure>
            )}

            <div className='flex-1 min-w-0'>
              <h3 className='text-sm lg:text-base font-semibold mb-2'>
                {post.title}
              </h3>
              <div className='flex flex-wrap items-center gap-2 text-xs text-muted-foreground'>
                {post.over_18 && (
                  <span className='inline-flex items-center gap-2'>
                    <span className='text-red-500 font-bold'>NSFW</span>
                    <span className='text-muted-foreground'>•</span>
                  </span>
                )}

                <div className='flex items-center gap-1'>
                  <TypeIcon className='h-3.5 w-3.5' />
                  <span>{typeLabel}</span>
                </div>
                <span className='text-muted-foreground'>•</span>
                <span>Posted by u/{post.author}</span>
                <span className='text-muted-foreground'>•</span>
                <span>{formatRedditDate(post.created_utc)}</span>
                <span className='text-muted-foreground'>•</span>
                <div className='flex items-center gap-1'>
                  <MessageCircle className='h-3.5 w-3.5' />
                  {post.num_comments} comments
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
