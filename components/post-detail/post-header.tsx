'use client'

import { useState, useEffect } from 'react'
import { formatRedditDate } from '@/lib/utils/date'
import { getGalleryImages } from '@/lib/utils/post'
import { CardHeader } from '@/components/ui/card'
import { MessageCircle, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselApi,
} from '@/components/ui/carousel'
import { ImageModal } from './image-modal'
import { RedditPost } from '@/types/reddit'

interface PostHeaderProps {
  post: RedditPost
}

export function PostHeader({ post }: PostHeaderProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  const isImage = post.url.match(/\.(jpeg|jpg|gif|png)$/i)
  const isVideo = post.is_video && post.media?.reddit_video
  const isGallery = post.is_gallery
  const isLink = !isImage && !isVideo && !isGallery && !post.selftext

  const galleryImages = isGallery ? getGalleryImages(post) : []

  useEffect(() => {
    if (!api) return

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  return (
    <CardHeader className='space-y-4 px-3 md:px-4'>
      <div className='space-y-2'>
        <h1 className='text-xl md:text-2xl font-bold'>
          {isLink ? (
            <a
              href={post.url}
              target='_blank'
              rel='noopener noreferrer'
              className='hover:underline hover:text-primary transition-colors'
            >
              {post.title}
            </a>
          ) : (
            post.title
          )}
        </h1>
        <div className='flex flex-wrap items-center gap-4 text-sm text-muted-foreground'>
          <span>Posted by u/{post.author}</span>
          <span>{formatRedditDate(post.created_utc)}</span>
          <a href="#comments" className='flex items-center gap-1 hover:underline hover:text-primary transition-colors'>
            <MessageCircle className='h-4 w-4' />
            {post.num_comments} comments
          </a>
        </div>
      </div>

      {isLink && (
        <Button variant='outline' className='gap-2 self-start' asChild>
          <a href={post.url} target='_blank' rel='noopener noreferrer'>
            <ExternalLink className='h-4 w-4' />
            Visit Link
          </a>
        </Button>
      )}

      {isGallery && galleryImages.length > 0 && (
        <div className='max-w-full w-[800px] mx-auto pb-4'>
          <div className='relative'>
            <Carousel setApi={setApi} className='w-full mx-auto'>
              <CarouselPrevious className='hidden xl:inline-flex' />
              <CarouselContent>
                {galleryImages.map((imageUrl, index) => (
                  <CarouselItem key={index}>
                    <div className='h-full object-contain bg-black/5 dark:bg-white/5 rounded-lg overflow-hidden flex justify-center items-center'>
                      <ImageModal
                        src={imageUrl}
                        alt={`${post.title} - Image ${index + 1}`}
                        redditUrl={post.url}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselNext className='hidden xl:inline-flex' />
            </Carousel>

            {count > 1 && (
              <div className='absolute -bottom-6 left-0 right-0 flex justify-center gap-2'>
                {Array.from({ length: count }).map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === current
                        ? 'bg-primary'
                        : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    }`}
                    onClick={() => api?.scrollTo(index)}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {isImage && (
        <div className='w-full max-w-[800px] mx-auto'>
          <div className='bg-black/5 dark:bg-white/5 rounded-lg overflow-hidden flex justify-center items-center'>
            <ImageModal src={post.url} alt={post.title} redditUrl={post.url} />
          </div>
        </div>
      )}

      {isVideo && (
        <div className='w-full max-w-[800px] mx-auto'>
          <div className='aspect-[16/9] relative bg-black/5 dark:bg-white/5 rounded-lg overflow-hidden'>
            <video
              controls
              src={post?.media?.reddit_video?.fallback_url}
              className='absolute inset-0 w-full h-full'
              preload='metadata'
            />
          </div>
        </div>
      )}
    </CardHeader>
  )
}
