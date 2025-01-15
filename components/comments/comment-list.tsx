"use client";

import { RedditComment } from "@/types/reddit";
import { Comment } from "./comment";

interface CommentListProps {
  comments: RedditComment[];
}

export function CommentList({ comments }: CommentListProps) {
  if (!comments?.length) {
    return (
      <div className="text-center text-muted-foreground py-4">
        No comments yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <Comment key={comment.id} comment={comment} isTopLevel={true} />
      ))}
    </div>
  );
}