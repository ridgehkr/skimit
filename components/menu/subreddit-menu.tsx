'use client'

import { useSubredditStore, type SavedSubreddit } from '@/store/subreddits'
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { SubredditItem } from '@/components/menu/subreddit-item'
import { SettingsMenu } from '@/components/menu/settings-menu'
import { toast } from 'sonner'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Edit2, AArrowDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SubredditSearch } from '@/components/menu/subreddit-search'

interface MenuGroupProps {
  subreddits: SavedSubreddit[]
  isEditMode: boolean
}

function MenuGroup({ subreddits, isEditMode }: MenuGroupProps) {
  const {
    toggleFavorite,
    removeSubreddit,
    setSubreddits,
    addSubreddit,
    subreddits: allSubreddits,
  } = useSubredditStore()
  const pathname = usePathname()
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  )

  /**
   * Remove a subreddit from the saved subreddits list
   *
   * @param subredditName - The name of the subreddit to remove
   * @return {void}
   */
  const handleDeleteSubreddit = (subredditName: string) => {
    const cacheRemoved = allSubreddits.find((s) => s.name === subredditName)
    if (!cacheRemoved) return

    removeSubreddit(subredditName)
    toast('Subreddit Removed', {
      description: `r/${subredditName} removed from saved subreddits.`,
      action: {
        label: 'Undo',
        onClick: () => {
          addSubreddit(cacheRemoved)
        },
      },
    })
  }

  /**
   * When a subreddit drag ends, update the order of the subreddits
   *
   * @param {DragEndEvent} event - The drag end event from dnd-kit
   * @param {string} event.active.id - The id of the active (dragged) item
   * @param {string} event.over.id - The id of the item that the active item was dropped over
   * @returns {void}
   */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = subreddits.findIndex((s) => s.name === active.id)
    const newIndex = subreddits.findIndex((s) => s.name === over.id)

    const newSubreddits = [...subreddits]
    const [movedItem] = newSubreddits.splice(oldIndex, 1)
    newSubreddits.splice(newIndex, 0, movedItem)

    // Update order while preserving favorite status
    const updated = newSubreddits.map((sub, index) => ({
      ...sub,
      order: index,
    }))

    setSubreddits([
      ...updated,
      ...allSubreddits.filter((s) => !updated.some((u) => u.name === s.name)),
    ])
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={subreddits.map((s) => s.name)}
        strategy={verticalListSortingStrategy}
      >
        <ul className='flex flex-col space-y-1'>
          {subreddits.map((subreddit) => (
            <li key={subreddit.name} className='w-full'>
              <SubredditItem
                id={subreddit.name}
                subreddit={subreddit}
                isSelected={pathname.startsWith(`/r/${subreddit.name}/`)}
                onToggleFavorite={() => toggleFavorite(subreddit.name)}
                onDelete={() => handleDeleteSubreddit(subreddit.name)}
                isReorderMode={isEditMode}
              />
            </li>
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  )
}

/**
 * Displays a list of saved subreddits with options to edit, sort, and add new subreddits.
 */
export function SubredditMenu() {
  const [isEditMode, setIsEditMode] = useState(false)
  const [showSearchModal, setShowSearchModal] = useState(false)
  const { subreddits, sort, hydrated } = useSubredditStore()

  // Prevent rendering before the store is hydrated
  if (!hydrated) {
    return (
      <div className='flex flex-col items-center flex-grow justify-center h-full space-y-4 text-center'>
        <h3 className='scroll-m-20 text-lg font-medium tracking-tight'>
          Loading…
        </h3>
      </div>
    )
  }

  const favorites = subreddits.filter((s) => s.isFavorite)
  const nonFavorites = subreddits.filter((s) => !s.isFavorite)

  return (
    <>
      {subreddits.length === 0 && (
        <div className='flex flex-col items-center flex-grow justify-center h-full space-y-4 text-center'>
          <h3 className='scroll-m-20 text-lg font-medium tracking-tight'>
            Get started by adding your favorite subreddits
          </h3>

          <Button
            size='sm'
            onClick={() => setShowSearchModal(true)}
            className='rounded-sm'
          >
            <Plus className='h-4 w-4' />
            Add
          </Button>
        </div>
      )}

      <div className='flex flex-col flex-grow space-y-6'>
        {favorites.length > 0 && (
          <div>
            <h3 className='text-sm font-medium text-muted-foreground mb-2'>
              Favorites
            </h3>

            <MenuGroup subreddits={favorites} isEditMode={isEditMode} />
          </div>
        )}

        {nonFavorites.length > 0 && (
          <div>
            <h3 className='text-sm font-medium text-muted-foreground mb-2'>
              Subreddits
            </h3>

            <MenuGroup subreddits={nonFavorites} isEditMode={isEditMode} />
          </div>
        )}

        {subreddits.length > 0 && (
          <div className='flex flex-col items-center justify-center gap-4 mx-auto'>
            <Button
              onClick={() => setShowSearchModal(true)}
              className='rounded-sm mx-auto grow-0'
              variant='outline'
            >
              <Plus className='h-4 w-4' />
              <span>Add</span>
            </Button>

            {isEditMode &&
              (favorites.length >= 2 || nonFavorites.length >= 2) && (
                <Button
                  variant='link'
                  size='sm'
                  onClick={sort}
                  type='button'
                  className='text-muted-foreground hover:text-foreground has-[>svg]:px-0 md:has-[>svg]:px-2.5 h-auto'
                >
                  <AArrowDown className='h-4 w-4 mr-1' />
                  Sort A-Z
                </Button>
              )}
          </div>
        )}
      </div>

      {/* Toggle edit mode and sorting */}
      {subreddits.length > 0 && (
        <div className='flex mt-auto items-center justify-between gap-4'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setIsEditMode((em) => !em)}
            className={cn(
              'text-muted-foreground hover:text-foreground has-[>svg]:px-0 md:has-[>svg]:px-2.5',
              isEditMode && 'text-primary hover:text-primary'
            )}
          >
            <Edit2 className='h-4 w-4 mr-1' />
            {isEditMode ? 'Done' : 'Edit Subreddits'}
          </Button>

          <SettingsMenu />
        </div>
      )}

      <SubredditSearch
        isOpen={showSearchModal}
        setIsOpen={setShowSearchModal}
      />
    </>
  )
}
