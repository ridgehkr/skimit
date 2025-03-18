'use client'

import { RedditPost } from '@/types/reddit'
import { PostCard } from '@/components/post-card'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface PostsListProps {
  posts: RedditPost[]
  loading: boolean
  loadingMore: boolean
  hasMore: boolean
  onLoadMore: () => void
}

/**
 * Display a list of Reddit post excerpts in card format
 * @param {PostsListProps} props - The component properties
 * @returns - A component displaying a list of Reddit post excerpts
 */
export function PostsList({
  posts,
  loading,
  loadingMore,
  hasMore,
  onLoadMore,
}: PostsListProps) {
  if (loading) {
    return (
      <div className='flex justify-center items-center h-full py-4'>
        <p>Loading posts…</p>
      </div>
    )
  }

  return (
    <div className='h-full space-y-4'>
      <ul className='space-y-4'>
        {posts.map((post) => (
          <li key={post.id}>
            <PostCard post={post} />
          </li>
        ))}
      </ul>

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
                Loading…
              </>
            ) : (
              'Load More Posts'
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
