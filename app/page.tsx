'use client'

import { useEffect, useState, useCallback } from 'react'
import { PostsList } from '@/components/posts-list'
import { PostDetail } from '@/components/post-detail'
import { fetchRedditPosts, fetchSubredditInfo } from '@/lib/reddit'
import { subredditStorage } from '@/lib/subreddits'
import { Sidebar } from '@/components/sidebar'
import { AppHeader } from '@/components/layout/app-header'
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
import type { SavedSubreddit } from '@/lib/subreddits'

export default function Home() {
  const [posts, setPosts] = useState<RedditPost[]>([])
  const [selectedSubreddit, setSelectedSubreddit] = useState('all')
  const [searchInput, setSearchInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [savedSubreddits, setSavedSubreddits] = useState<SavedSubreddit[]>([])
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortBy>('hot')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [after, setAfter] = useState<string | null>(null)
  const [subredditInfo, setSubredditInfo] = useState<SubredditInfo | null>(null)

  // initialize the selected subreddit to the top of the saved subreddits
  useEffect(() => {
    const topSubreddit = subredditStorage.getSaved()[0]
    if (topSubreddit) {
      setSelectedSubreddit(topSubreddit.name)
    }
  }, [setSelectedSubreddit])

  const loadPosts = useCallback(
    async (isLoadingMore = false) => {
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
            selectedSubreddit,
            sortBy,
            isLoadingMore ? after : undefined
          ),
          !isLoadingMore
            ? fetchSubredditInfo(selectedSubreddit)
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
          // Save subreddit with icon if available
          subredditStorage.save(selectedSubreddit, info?.icon_img)
          setSavedSubreddits(subredditStorage.getSaved())
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to load posts'
        if (message === 'Subreddit not found') {
          setError(
            `Looks like r/${selectedSubreddit} doesn't exist. Double-check the spelling or try searching for a different subreddit!`
          )
        } else {
          setError(`Could not load the subreddit r/${selectedSubreddit}`)
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
    },
    [selectedSubreddit, sortBy, after, subredditInfo]
  )

  const handleSubredditSelect = useCallback((name: string) => {
    setSelectedSubreddit(name)
    setSelectedPostId(null)
  }, [])

  const handleDeleteSubreddit = useCallback((name: string) => {
    subredditStorage.remove(name)
    setSavedSubreddits(subredditStorage.getSaved())
  }, [])

  const handleUpdateSubreddits = useCallback((subreddits: SavedSubreddit[]) => {
    subredditStorage.updateOrder(subreddits)
    setSavedSubreddits(subreddits)
  }, [])

  const handleSearch = useCallback((subredditName: string) => {
    setSelectedSubreddit(subredditName)
    setSearchInput('')
    setSelectedPostId(null)
  }, [])

  // Load saved subreddits on mount
  useEffect(() => {
    setSavedSubreddits(subredditStorage.getSaved())
  }, [])

  // Load posts when subreddit or sort changes
  useEffect(() => {
    const controller = new AbortController()
    loadPosts()
    return () => controller.abort()

    // do not add loadPosts as a dependency to avoid infinite loop
  }, [selectedSubreddit, sortBy])

  return (
    <div className='min-h-screen flex flex-col'>
      <AppHeader onOpenSidebar={() => setSidebarOpen(true)} />
      <Sidebar
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
        subreddits={savedSubreddits}
        onSelectSubreddit={handleSubredditSelect}
        onDeleteSubreddit={handleDeleteSubreddit}
        selectedSubreddit={selectedSubreddit}
        onUpdateSubreddits={handleUpdateSubreddits}
        onSubredditChange={setSearchInput}
        searchInput={searchInput}
        onSearch={handleSearch}
        onCollapse={setSidebarCollapsed}
      />

      <main
        className={`flex-1 transition-all duration-300 ${
          sidebarCollapsed ? 'md:ml-[60px]' : 'md:ml-[300px]'
        }`}
      >
        <div className='px-4 pt-4'>
          {!selectedPostId ? (
            <div className='flex flex-col h-[calc(100vh-4rem)]'>
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
                    onPostClick={(postId) => setSelectedPostId(postId)}
                  />
                )}
              </div>
            </div>
          ) : (
            <div className='h-[calc(100vh-5rem)] overflow-y-auto'>
              <PostDetail
                id={selectedPostId}
                onBack={() => setSelectedPostId(null)}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
