'use client'

import { useEffect, useState } from 'react'
import { PostsList } from '@/components/posts-list'
import { useTheme } from 'next-themes'
import { Card, CardContent } from '@/components/ui/card'
import { Search } from 'lucide-react'
import { SubredditHeader } from '@/components/subreddit-header'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { SortBy } from '@/types/reddit'
import { useMobileNav } from '@/store/nav'
import { useSubredditStore } from '@/store/subreddits'
import { useSubreddit } from '@/hooks/use-subreddit'

interface SubredditPageClientProps {
  subreddit: string
}

/**
 * Displays a subreddit page with a list of posts, a subreddit header, and a post sorting option.
 */
export default function SubredditPageClient({
  subreddit,
}: SubredditPageClientProps) {
  // local state for the post sorting value
  const [sortBy, setSortBy] = useState<SortBy>('hot')

  const { closeNav } = useMobileNav()

  const { allowNSFW, hydrated } = useSubredditStore()

  /**
   * Reset the scroll position and close the mobile nav overlay when the subreddit changes
   */
  useEffect(() => {
    closeNav()

    // just in case the user has scrolled down the page, we want to reset the scroll position with a new subreddit
    window.scrollTo(0, 0)
  }, [closeNav])

  const {
    posts,
    subredditInfo,
    error,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useSubreddit(subreddit, {
    sortBy,
    allowNSFW,
  })

  return (
    <div>
      <div className='flex flex-col h-full p-0'>
        <div className='grid gap-6 lg:flex items-center justify-between md:ml-5 py-1 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:top-16 z-40'>
          <SubredditHeader
            info={subredditInfo}
            loading={isLoading}
            error={error ? error.message : null}
          />
          <div className='flex items-center gap-2'>
            <span className='text-sm font-medium whitespace-nowrap'>
              Sort by
            </span>
            <Select
              value={sortBy}
              onValueChange={(value) => setSortBy(value as SortBy)}
            >
              <SelectTrigger className='w-[100px]'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='hot'>Hot</SelectItem>
                <SelectItem value='new'>New</SelectItem>
                <SelectItem value='top'>Top</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className='flex-1 lg:overflow-hidden py-4'>
          {error ? (
            <Card className='mb-4 border-muted'>
              <CardContent className='flex flex-col items-center text-center p-8 space-y-4'>
                <Search className='h-12 w-12 text-muted-foreground' />
                <div className='space-y-2'>
                  <h3 className='text-lg font-medium'>Oops!</h3>
                  <p className='text-muted-foreground'>{error.message}</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <PostsList
              posts={posts}
              loading={isLoading}
              loadingMore={isFetchingNextPage}
              hasMore={hasNextPage}
              onLoadMore={() => fetchNextPage()}
            />
          )}
        </div>
      </div>
    </div>
  )
}
