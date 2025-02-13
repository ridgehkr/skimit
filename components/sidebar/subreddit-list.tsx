'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SavedSubreddit, SubredditGroup } from '@/lib/subreddits';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { SubredditSection } from './subreddit-section';
import { cn } from '@/lib/utils';

interface SubredditListProps {
  groups: SubredditGroup[];
  selectedSubreddit: string;
  onDelete: (subreddit: string, groupId: string) => void;
  onMoveSubreddit: (name: string, fromGroupId: string, toGroupId: string) => void;
  onToggleFavorite: (name: string, groupId: string) => void;
  onUpdateGroups: (groups: SubredditGroup[]) => void;
  isCollapsed?: boolean;
  isReorderMode?: boolean;
}

export function SubredditList({
  groups = [],
  selectedSubreddit,
  onDelete,
  onMoveSubreddit,
  onToggleFavorite,
  onUpdateGroups,
  isCollapsed = false,
  isReorderMode = false,
}: SubredditListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const [activeType, activeId, activeGroupId] = active.id.toString().split('::');
    const [overType, overId, overGroupId] = over.id.toString().split('::');

    if (activeType === 'group' && overType === 'group') {
      // Reorder groups
      const oldIndex = groups.findIndex(g => g.id === activeId);
      const newIndex = groups.findIndex(g => g.id === overId);
      const newGroups = arrayMove(groups, oldIndex, newIndex);
      onUpdateGroups(newGroups);
    } else if (activeType === 'subreddit' && overType === 'subreddit') {
      if (activeGroupId === overGroupId) {
        // Reorder within same group
        const group = groups.find(g => g.id === activeGroupId);
        if (!group) return;

        const oldIndex = group.subreddits.findIndex(s => s.name === activeId);
        const newIndex = group.subreddits.findIndex(s => s.name === overId);
        
        const newSubreddits = arrayMove(group.subreddits, oldIndex, newIndex);
        const newGroups = groups.map(g => 
          g.id === activeGroupId ? { ...g, subreddits: newSubreddits } : g
        );
        onUpdateGroups(newGroups);
      } else {
        // Move to different group
        onMoveSubreddit(activeId, activeGroupId, overGroupId);
      }
    }
  };

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
            <div className="space-y-6">
              {groups.map((group) => (
                <SubredditSection
                  key={group.id}
                  group={group}
                  selectedSubreddit={selectedSubreddit}
                  onDelete={onDelete}
                  onToggleFavorite={onToggleFavorite}
                  onUpdateGroups={onUpdateGroups}
                  isCollapsed={isCollapsed}
                  isReorderMode={isReorderMode}
                />
              ))}
            </div>
          </DndContext>
        ) : (
          <div className="space-y-6">
            {groups.map((group) => (
              <SubredditSection
                key={group.id}
                group={group}
                selectedSubreddit={selectedSubreddit}
                onDelete={onDelete}
                onToggleFavorite={onToggleFavorite}
                onUpdateGroups={onUpdateGroups}
                isCollapsed={isCollapsed}
                isReorderMode={isReorderMode}
              />
            ))}
          </div>
        )}
      </div>
    </ScrollArea>
  );
}