'use client'

import { RedditPost } from '@/types/reddit'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PostCard } from '@/components/post-card'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface PostsListProps {
  posts: RedditPost[]
  loading: boolean
  loadingMore: boolean
  hasMore: boolean
  onLoadMore: () => void
  onPostClick: (postId: string) => void
}

export function PostsList({
  posts,
  loading,
  loadingMore,
  hasMore,
  onLoadMore,
  onPostClick,
}: PostsListProps) {
  if (loading) {
    return (
      <div className='flex justify-center items-center h-full'>
        <p>Loading posts...</p>
      </div>
    )
  }

  return (
    <div className='h-full overflow-y-auto px-4 -mx-4'>
      <div className='space-y-4'>
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onClick={() => onPostClick(post.id)}
          />
        ))}

        {hasMore && (
          <div className='flex justify-center py-4'>
            <Button
              variant='outline'
              size='lg'
              onClick={onLoadMore}
              disabled={loadingMore}
            >
              {loadingMore ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Loading...
                </>
              ) : (
                'Load More Posts'
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
