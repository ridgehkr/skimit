'use client'

import { SubredditInfo } from '@/types/reddit'
import { formatRedditDate } from '@/lib/utils/reddit-date'
import { Skeleton } from '@/components/ui/skeleton'
import { Users, Clock, Calendar } from 'lucide-react'
import Image from 'next/image'

interface SubredditHeaderProps {
  info: SubredditInfo | null
  loading: boolean
  error: string | null
}

export function SubredditHeader({
  info,
  loading,
  error,
}: SubredditHeaderProps) {
  if (loading) {
    return (
      <div className='space-y-4'>
        <Skeleton className='h-8 w-64' />
        <Skeleton className='h-4 w-full max-w-2xl' />
        <div className='flex gap-6'>
          <Skeleton className='h-4 w-24' />
          <Skeleton className='h-4 w-24' />
          <Skeleton className='h-4 w-24' />
        </div>
      </div>
    )
  }

  if (error || !info) {
    return (
      <h2 className='text-lg md:text-xl font-medium'>
        r/{info?.display_name || 'all'}
      </h2>
    )
  }

  return (
    <div className='space-y-3'>
      <div className='space-y-1'>
        <div className='flex items-start gap-3'>
          {info.icon_img ? (
            <div className='relative w-10 h-10'>
              <Image
                src={info.icon_img}
                alt={`r/${info.display_name} icon`}
                width={40}
                height={40}
                className='rounded-full'
              />
            </div>
          ) : (
            <div className='w-8 h-8 rounded-full bg-accent flex items-center justify-center text-sm font-medium'>
              r/
            </div>
          )}
          <div>
            <h2 className='text-xl md:text-2xl font-bold'>
              r/{info.display_name}
              {info.over18 && (
                <span className='ml-2 text-xs bg-red-500 text-white px-2 py-0.5 rounded-full'>
                  NSFW
                </span>
              )}
            </h2>
            <h3 className='text-lg text-muted-foreground font-medium'>
              {info.title}
            </h3>
          </div>
        </div>
      </div>

      {info.public_description && (
        <p className='text-sm text-muted-foreground max-w-3xl'>
          {info.public_description}
        </p>
      )}

      <div className='flex flex-wrap gap-x-6 gap-y-4 text-sm'>
        <div className='flex items-center gap-2'>
          <Users className='h-4 w-4' />
          <span className='inline-flex gap-1 white-space-nowrap'>
            <span className='font-medium'>
              {formatNumber(info.subscribers)}
            </span>
            <span className='text-muted-foreground'>members</span>
          </span>
        </div>
        <div className='flex items-center gap-2'>
          <Clock className='h-4 w-4' />
          <span className='white-space-nowrap inline-flex gap-1'>
            <span className='font-medium'>
              {formatNumber(info.active_user_count)}
            </span>
            <span className='text-muted-foreground'>online</span>
          </span>
        </div>
        <div className='flex items-center gap-2'>
          <Calendar className='h-4 w-4' />
          <span className='text-muted-foreground white-space-nowrap'>
            Created {formatRedditDate(info.created_utc)}
          </span>
        </div>
      </div>
    </div>
  )
}

// Helper function to format numbers
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toString()
}
