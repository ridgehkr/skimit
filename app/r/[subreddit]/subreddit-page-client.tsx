'use client'

import { useEffect, useState } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { PostsList } from '@/components/posts-list'
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
import type { RedditPost, SortBy, SubredditInfo } from '@/types/reddit'
import { fetchRedditPosts, fetchSubredditInfo } from '@/lib/reddit'
import { useMobileNav } from '@/store/nav'
import { useSubredditStore } from '@/store/subreddits'

interface SubredditPageClientProps {
  subreddit: string
}

interface FetchPostsParams {
  subreddit: string
  sortBy: SortBy
  after?: string
  subredditInfo?: SubredditInfo | null
  allowNSFW?: boolean
}

const fetchPosts = async ({
  subreddit,
  sortBy,
  after = undefined,
  subredditInfo = null,
  allowNSFW = false,
}: FetchPostsParams): Promise<
  [RedditPost[], SubredditInfo | null, string | null]
> => {
  const [postsData, info] = await Promise.all([
    fetchRedditPosts(subreddit, sortBy, after),
    !after ? fetchSubredditInfo(subreddit) : Promise.resolve(subredditInfo),
  ])

  const posts = postsData.posts.filter((post) => !post.over_18 || allowNSFW)

  return [posts, info ?? null, postsData.after]
}

export default function SubredditPageClient({
  subreddit,
}: SubredditPageClientProps) {
  const [mounted, setMounted] = useState(false)
  const [sortBy, setSortBy] = useState<SortBy>('hot')
  const { closeNav } = useMobileNav()
  const allowNSFW = useSubredditStore((state) => state.allowNSFW)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)

    // if we're in mobile, we want to close the nav overlay when a new subreddit loads
    closeNav()

    window.scrollTo(0, 0)
  }, [])

  const {
    data,
    error,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['posts', subreddit, sortBy],
    queryFn: ({ pageParam = undefined }: { pageParam?: string }) =>
      fetchPosts({ subreddit, sortBy, allowNSFW, after: pageParam }),
    getNextPageParam: (lastPage) => lastPage?.[2] || null, // `after` value for pagination
    initialPageParam: undefined,
  })

  if (!mounted) {
    return null
  }

  const posts = data?.pages.flatMap((page) => page[0]) || []

  const subredditInfo = data?.pages[0]?.[1] || null

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
