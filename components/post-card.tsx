'use client'

import { RedditPost } from '@/types/reddit'
import { formatRedditDate } from '@/lib/utils/reddit-date'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowUpIcon,
  ArrowDownIcon,
  MessageCircle,
  Image as ImageIcon,
  Link as LinkIcon,
  Video as VideoIcon,
  FileText,
  Images,
} from 'lucide-react'
import { useRedditAuth } from '@/lib/auth/reddit-auth'

interface PostCardProps {
  post: RedditPost
}

/**
 * Determine the type of Reddit post based on its populated properties
 * @param {RedditPost} post - The Reddit post object
 * @returns - An object containing the icon and label for the post type
 */
function getPostType(post: RedditPost) {
  if (post.is_gallery) {
    return { icon: Images, label: 'Gallery' }
  }
  if (post.is_video) {
    return { icon: VideoIcon, label: 'Video' }
  }
  if (post.url.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return { icon: ImageIcon, label: 'Image' }
  }
  if (post.selftext) {
    return { icon: FileText, label: 'Text' }
  }
  return { icon: LinkIcon, label: 'Link' }
}

/**
 * Get the thumbnail image for a Reddit post
 * @param {RedditPost} post - The Reddit post object
 * @returns - The URL of the thumbnail image, or null if not found
 */
function getThumbnail(post: RedditPost): string | null {
  // First try to get the preview image
  if (post.preview?.images[0]?.resolutions) {
    // Get the medium size image if available, otherwise the smallest
    const resolutions = post.preview.images[0].resolutions
    const mediumImage = resolutions[Math.min(2, resolutions.length - 1)]
    if (mediumImage?.url) {
      return mediumImage.url.replace(/&amp;/g, '&')
    }
  }

  // For gallery posts, try to get the first image
  if (post.is_gallery && post.gallery_data?.items[0]?.media_id) {
    const mediaId = post.gallery_data.items[0].media_id
    const mediaItem = post.media_metadata?.[mediaId]

    if (mediaItem && 'p' in mediaItem && Array.isArray(mediaItem.p)) {
      // Get the medium size if available, otherwise the smallest
      const preview = mediaItem.p[Math.min(2, mediaItem.p.length - 1)]
      if (preview?.u) {
        return preview.u.replace(/&amp;/g, '&')
      }
    }
  }

  // If it's a direct image URL
  if (post.url.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return post.url
  }

  return null
}

/**
 * Display a Reddit post excerpt in a card format
 * @param post - The Reddit post object
 * @returns - A card component displaying the post excerpt
 */
export function PostCard({ post }: PostCardProps) {
  const { isAuthenticated } = useRedditAuth()
  const { icon: TypeIcon, label: typeLabel } = getPostType(post)
  const thumbnail = getThumbnail(post)

  return (
    <Link href={`/r/${post.subreddit}/${post.id}`} className='block'>
      <Card className='hover:bg-accent/50 transition-colors'>
        <CardContent className='p-4'>
          <div className='flex gap-3'>
            {isAuthenticated && (
              <div className='flex flex-col items-center gap-0.5'>
                <button className='h-8 w-8 flex items-center justify-center rounded-md hover:bg-accent'>
                  <ArrowUpIcon className='h-4 w-4' />
                </button>
                <span className='text-sm font-medium'>{post.score}</span>
                <button className='h-8 w-8 flex items-center justify-center rounded-md hover:bg-accent'>
                  <ArrowDownIcon className='h-4 w-4' />
                </button>
              </div>
            )}

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
              <h3 className='font-semibold mb-2'>{post.title}</h3>
              <div className='flex flex-wrap items-center gap-2 text-xs text-muted-foreground'>
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
