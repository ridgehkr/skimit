'use client';

import { Button } from '@/components/ui/button';
import { SavedSubreddit } from '@/lib/subreddits';
import { Star, StarOff, Trash2, GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';

interface SortableItemProps {
  subreddit: SavedSubreddit;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
  isCollapsed?: boolean;
  isReorderMode?: boolean;
}

export function SortableItem({
  subreddit,
  isSelected,
  onSelect,
  onDelete,
  onToggleFavorite,
  isCollapsed = false,
  isReorderMode = false,
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: subreddit.name,
    disabled: !isReorderMode,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isCollapsed) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="flex items-center justify-center"
      >
        <Button
          variant={isSelected ? 'secondary' : 'ghost'}
          size="icon"
          className="w-10 h-10 rounded-lg"
          onClick={onSelect}
          title={`r/${subreddit.name}`}
        >
          {subreddit.iconUrl ? (
            <img 
              src={subreddit.iconUrl} 
              alt={`r/${subreddit.name} icon`}
              className="w-6 h-6 rounded-full"
            />
          ) : (
            subreddit.name.charAt(0).toUpperCase()
          )}
        </Button>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between group"
    >
      <div className="flex items-center flex-1">
        {isReorderMode && (
          <Button
            variant="ghost"
            size="icon"
            className="cursor-grab"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant={isSelected ? 'secondary' : 'ghost'}
          className="flex-1 justify-start font-normal gap-2"
          onClick={onSelect}
        >
          {subreddit.iconUrl ? (
            <img 
              src={subreddit.iconUrl} 
              alt={`r/${subreddit.name} icon`}
              className="w-5 h-5 rounded-full"
            />
          ) : (
            <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center text-xs">
              r/
            </div>
          )}
          r/{subreddit.name}
        </Button>
      </div>
      <div className={cn(
        "flex opacity-0 group-hover:opacity-100 transition-opacity",
        isReorderMode && "opacity-100"
      )}>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleFavorite}
          className={subreddit.isFavorite ? 'text-yellow-500' : ''}
        >
          {subreddit.isFavorite ? (
            <StarOff className="h-4 w-4" />
          ) : (
            <Star className="h-4 w-4" />
          )}
        </Button>
        <Button variant="ghost" size="icon" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}