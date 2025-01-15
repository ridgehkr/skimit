'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SavedSubreddit } from '@/lib/subreddits';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { SubredditSection } from './subreddit-section';
import { cn } from '@/lib/utils';

interface SubredditListProps {
  subreddits: SavedSubreddit[];
  onSelect: (subreddit: string) => void;
  onDelete: (subreddit: string) => void;
  selectedSubreddit: string;
  onUpdateSubreddits: (subreddits: SavedSubreddit[]) => void;
  isCollapsed?: boolean;
  isReorderMode?: boolean;
}

export function SubredditList({
  subreddits,
  onSelect,
  onDelete,
  selectedSubreddit,
  onUpdateSubreddits,
  isCollapsed = false,
  isReorderMode = false,
}: SubredditListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const favorites = subreddits.filter((s) => s.isFavorite);
  const others = subreddits.filter((s) => !s.isFavorite);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = subreddits.findIndex((s) => s.name === active.id);
      const newIndex = subreddits.findIndex((s) => s.name === over.id);

      const newItems = arrayMove(subreddits, oldIndex, newIndex);
      onUpdateSubreddits(newItems);
    }
  };

  const content = (
    <div className="space-y-6">
      <SubredditSection
        title="Favorites"
        subreddits={favorites}
        selectedSubreddit={selectedSubreddit}
        onSelect={onSelect}
        onDelete={onDelete}
        onUpdateSubreddits={onUpdateSubreddits}
        allSubreddits={subreddits}
        isCollapsed={isCollapsed}
        isReorderMode={isReorderMode}
      />
      <SubredditSection
        title={favorites.length > 0 ? 'Others' : undefined}
        subreddits={others}
        selectedSubreddit={selectedSubreddit}
        onSelect={onSelect}
        onDelete={onDelete}
        onUpdateSubreddits={onUpdateSubreddits}
        allSubreddits={subreddits}
        isCollapsed={isCollapsed}
        isReorderMode={isReorderMode}
      />
    </div>
  );

  return (
    <ScrollArea className="h-[400px] px-1 -mx-1">
      <div className={cn(
        "transition-all duration-300",
        isCollapsed ? "opacity-0" : "opacity-100"
      )}>
        {isReorderMode ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            {content}
          </DndContext>
        ) : (
          content
        )}
      </div>
    </ScrollArea>
  );
}