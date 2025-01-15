"use client";

import { SavedSubreddit } from "@/lib/subreddits";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableItem } from "./sortable-item";
import { cn } from "@/lib/utils";

interface SubredditSectionProps {
  title?: string;
  subreddits: SavedSubreddit[];
  selectedSubreddit: string;
  onSelect: (subreddit: string) => void;
  onDelete: (subreddit: string) => void;
  onUpdateSubreddits: (subreddits: SavedSubreddit[]) => void;
  allSubreddits: SavedSubreddit[];
  isCollapsed?: boolean;
  isReorderMode?: boolean;
}

export function SubredditSection({
  title,
  subreddits,
  selectedSubreddit,
  onSelect,
  onDelete,
  onUpdateSubreddits,
  allSubreddits,
  isCollapsed = false,
  isReorderMode = false,
}: SubredditSectionProps) {
  // Only render if we have subreddits
  if (!subreddits?.length) {
    return null;
  }

  const items = (
    <div className="space-y-1">
      {subreddits.map((subreddit) => (
        <SortableItem
          key={subreddit.name}
          subreddit={subreddit}
          isSelected={selectedSubreddit === subreddit.name}
          onSelect={() => onSelect(subreddit.name)}
          onDelete={() => onDelete(subreddit.name)}
          onToggleFavorite={() => {
            const updatedSubreddits = allSubreddits.map(s => 
              s.name === subreddit.name 
                ? { ...s, isFavorite: !s.isFavorite }
                : s
            );
            onUpdateSubreddits(updatedSubreddits);
          }}
          isCollapsed={isCollapsed}
          isReorderMode={isReorderMode}
        />
      ))}
    </div>
  );

  return (
    <div className="space-y-2">
      {title && !isCollapsed && (
        <h4 className="text-sm font-medium text-muted-foreground px-2 mb-2">
          {title}
        </h4>
      )}
      {isReorderMode ? (
        <SortableContext
          items={subreddits.map(s => s.name)}
          strategy={verticalListSortingStrategy}
        >
          {items}
        </SortableContext>
      ) : (
        items
      )}
    </div>
  );
}