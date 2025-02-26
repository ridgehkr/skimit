'use client'

import { RedditComment } from '@/types/reddit'
import { CommentReplies } from './comment-replies'
import { MarkdownContent } from '@/components/markdown-content'
import { useComments } from '@/lib/contexts/comment-context'
import { cn } from '@/lib/utils'
import { formatRedditDate } from '@/lib/utils/reddit-date'

interface CommentProps {
  comment: RedditComment
  isTopLevel?: boolean
}

export function Comment({ comment, isTopLevel = false }: CommentProps) {
  const { isCollapsed, toggleComment } = useComments()
  const replies =
    comment.replies?.data?.children?.map((child) => child.data) || []
  const isDeleted = !comment.author || !comment.body
  const hasReplies = replies.length > 0
  const collapsed = isCollapsed(comment.id)

  return (
    <div
      className={cn(
        'rounded-lg',
        isTopLevel && 'px-3 py-3 bg-muted/50 dark:bg-muted/30',
        (!isTopLevel || collapsed) && 'border p-3'
      )}
      data-comment-id={comment.id}
    >
      {isDeleted ? (
        <div className='text-muted-foreground text-sm'>Comment deleted</div>
      ) : (
        <div className='flex items-start gap-2'>
          <div className='flex-1'>
            <div
              onClick={() => toggleComment(comment.id)}
              className='cursor-pointer hover:opacity-80'
            >
              <div className='text-sm text-muted-foreground'>
                <span className='font-medium text-foreground'>
                  u/{comment.author}
                </span>
                <span className='mx-2'>•</span>
                <span>{formatRedditDate(comment.created_utc)}</span>
                {collapsed && <span className='ml-2 text-xs'>[collapsed]</span>}
              </div>
            </div>

            {!collapsed && (
              <div className='mt-2 space-y-2'>
                <MarkdownContent content={comment.body} />
                {hasReplies && <CommentReplies replies={replies} />}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
