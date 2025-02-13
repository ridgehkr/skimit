'use client'

import { useEffect, useState } from 'react'
import { PostsList } from '@/components/posts-list'
import { fetchRedditPosts, fetchSubredditInfo } from '@/lib/reddit'
import { subredditStorage } from '@/lib/subreddits'
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
import { useRouter } from 'next/navigation'

interface SubredditPageClientProps {
  params: {
    subreddit: string
  }
}

export default function SubredditPageClient({
  params,
}: SubredditPageClientProps) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [posts, setPosts] = useState<RedditPost[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortBy>('hot')
  const [after, setAfter] = useState<string | null>(null)
  const [subredditInfo, setSubredditInfo] = useState<SubredditInfo | null>(null)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const loadPosts = async (isLoadingMore = false) => {
    if (isLoadingMore) {
      setLoadingMore(true)
    } else {
      setLoading(true)
      setAfter(null)
    }
    setError(null)

    try {
      const [postsData, info] = await Promise.all([
        fetchRedditPosts(
          params.subreddit,
          sortBy,
          isLoadingMore ? after : undefined
        ),
        !isLoadingMore
          ? fetchSubredditInfo(params.subreddit)
          : Promise.resolve(subredditInfo),
      ])

      if (isLoadingMore) {
        setPosts((current) => [...current, ...postsData.posts])
      } else {
        setPosts(postsData.posts)
        setSubredditInfo(info)
      }

      setAfter(postsData.after)

      if (!isLoadingMore) {
        subredditStorage.save(params.subreddit, info?.icon_img)
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to load posts'
      if (message === 'Subreddit not found') {
        setError(
          `Looks like r/${params.subreddit} doesn't exist. Double-check the spelling or try searching for a different subreddit!`
        )
      } else {
        setError(`Could not load the subreddit r/${params.subreddit}`)
      }
      setPosts([])
      setSubredditInfo(null)
      setAfter(null)
    }

    if (isLoadingMore) {
      setLoadingMore(false)
    } else {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (mounted) {
      loadPosts()
    }
  }, [params.subreddit, sortBy, mounted])

  if (!mounted) {
    return null
  }

  return (
    <div className='pt-4'>
      <div className='flex flex-col h-[calc(100vh-64px)]'>
        <div className='grid gap-6 lg:flex items-center justify-between py-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b md:top-16 z-40 mx-4'>
          <SubredditHeader
            info={subredditInfo}
            loading={loading}
            error={error}
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
                  <p className='text-muted-foreground'>{error}</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <PostsList
              posts={posts}
              loading={loading}
              loadingMore={loadingMore}
              hasMore={!!after}
              onLoadMore={() => loadPosts(true)}
              onPostClick={(postId) =>
                router.push(`/r/${params.subreddit}/${postId}`)
              }
            />
          )}
        </div>
      </div>
    </div>
  )
}
