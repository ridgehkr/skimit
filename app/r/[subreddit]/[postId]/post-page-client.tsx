'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react'
import { fetchRedditPost, fetchComments } from '@/lib/reddit'
import { CommentList } from '@/components/comments/comment-list'
import { PostHeader } from '@/components/post-detail/post-header'
import { PostContent } from '@/components/post-detail/post-content'
import { PostDetailLoading } from '@/components/post-detail/loading'
import { PostDetailError } from '@/components/post-detail/error'
import { CommentProvider, useComments } from '@/lib/contexts/comment-context'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { RedditPost, RedditComment, CommentSortBy } from '@/types/reddit'
import { type SubredditPostProps } from './page'

interface CommentSectionProps {
  comments: RedditComment[]
  loadingComments: boolean
  commentSort: CommentSortBy
  onSortChange: (sort: CommentSortBy) => void
  hasComments: boolean
}

function CommentSection({
  comments,
  loadingComments,
  commentSort,
  onSortChange,
  hasComments,
}: CommentSectionProps) {
  const { collapseAll, expandAll, collapsedComments } = useComments()
  const allCollapsed = collapsedComments.size > 0

  return (
    <div className='mt-8'>
      <div className='grid lg:flex gap-6 items-center justify-between mb-4'>
        <div className='flex items-center gap-4'>
          <h2 className='text-xl font-semibold'>Comments</h2>
          {!loadingComments && hasComments && (
            <Button
              variant='outline'
              className='gap-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-xs'
              onClick={allCollapsed ? expandAll : collapseAll}
            >
              {allCollapsed ? (
                <>
                  <ChevronDown className='h-4 w-4' />
                  Expand All
                </>
              ) : (
                <>
                  <ChevronUp className='h-4 w-4' />
                  Collapse All
                </>
              )}
            </Button>
          )}
        </div>

        {!loadingComments && hasComments && (
          <div className='flex items-center gap-2'>
            <span className='text-sm font-medium'>Sort by</span>
            <Select
              value={commentSort}
              onValueChange={(value) => onSortChange(value as CommentSortBy)}
            >
              <SelectTrigger className='w-[130px]'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='best'>Best</SelectItem>
                <SelectItem value='top'>Top</SelectItem>
                <SelectItem value='new'>New</SelectItem>
                <SelectItem value='controversial'>Controversial</SelectItem>
                <SelectItem value='old'>Old</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <CommentList comments={comments} />
    </div>
  )
}

export default function PostPageClient({
  postId,
  subreddit,
}: SubredditPostProps) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [post, setPost] = useState<RedditPost | null>(null)
  const [comments, setComments] = useState<RedditComment[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingComments, setLoadingComments] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [commentSort, setCommentSort] = useState<CommentSortBy>('best')

  useEffect(() => {
    setMounted(true)

    window.scrollTo(0, 0) // Scroll to top on mount
  }, [setMounted])

  useEffect(() => {
    const loadPost = async () => {
      if (!mounted) return

      setLoading(true)
      setError(null)

      try {
        if (typeof postId !== 'string') {
          throw new Error('Invalid postId')
        }

        const postData = await fetchRedditPost(postId)
        if (!postData) {
          throw new Error('Post not found')
        }
        setPost(postData)

        setLoadingComments(true)
        const commentsData = await fetchComments(postId, commentSort)
        setComments(commentsData)
        setLoadingComments(false)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load post')
      } finally {
        setLoading(false)
      }
    }

    loadPost()
  }, [postId, mounted, commentSort])

  useEffect(() => {
    const loadComments = async () => {
      try {
        if (typeof postId !== 'string') {
          throw new Error('Invalid postId')
        }

        const commentsData = await fetchComments(postId, commentSort)
        setComments(commentsData)
      } catch (error) {
        console.error('Error loading comments:', error)
      } finally {
        setLoadingComments(false)
      }
    }

    if (post && !loading) {
      loadComments()
    }
  }, [postId, commentSort, post, loading, mounted])

  if (!mounted) {
    return null
  }

  if (loading) {
    return <PostDetailLoading onBack={() => router.back()} />
  }

  if (error) {
    return <PostDetailError message={error} onBack={() => router.back()} />
  }

  if (!post) {
    return (
      <PostDetailError message='Post not found' onBack={() => router.back()} />
    )
  }

  return (
    <CommentProvider>
      <div className='space-y-4'>
        <Button variant='ghost' className='mb-4 ml-1' asChild>
          <Link href={`/r/${subreddit}`}>
            <ArrowLeft className='h-4 w-4' />
            Back to r/{subreddit}
          </Link>
        </Button>

        <Card className='pb-6'>
          <PostHeader post={post} />

          {post?.selftext && <PostContent post={post} />}
        </Card>

        <CommentSection
          comments={comments}
          loadingComments={loadingComments}
          commentSort={commentSort}
          onSortChange={setCommentSort}
          hasComments={comments.length > 0}
        />
      </div>
    </CommentProvider>
  )
}
