"use client";

import { formatRedditDate } from '@/lib/utils/reddit-date';
import { CommentVotes } from './comment-votes';

interface CommentHeaderProps {
  author: string;
  createdAt: number;
  score: number;
  collapsed?: boolean;
}

export function CommentHeader({ author, createdAt, score, collapsed }: CommentHeaderProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <span className="font-medium text-foreground">u/{author}</span>
      <span>•</span>
      <span>{formatRedditDate(createdAt)}</span>
      <span>•</span>
      <CommentVotes score={score} />
      {collapsed && <span className="text-xs">[collapsed]</span>}
    </div>
  );
}