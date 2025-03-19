'use client'

import { RedditComment } from '@/types/reddit'
import { Comment } from './comment'

interface CommentRepliesProps {
  replies?: RedditComment[]
}

export function CommentReplies({ replies }: CommentRepliesProps) {
  if (!replies?.length) {
    return null
  }

  return (
    <div className='space-y-4 mt-5 pl-5'>
      {replies.map((reply) => (
        <div key={reply.id}>
          <Comment comment={reply} isTopLevel={false} />
        </div>
      ))}
    </div>
  )
}
