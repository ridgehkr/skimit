'use client'

import { Button } from '@/components/ui/button'
import { SavedSubreddit } from '@/store/subreddits'
import { Star, StarOff, Trash2, GripVertical } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import { buttonVariants } from '@/components/ui/button'

interface SortableItemProps {
  id: string
  subreddit: SavedSubreddit
  isSelected: boolean
  onDelete: () => void
  onToggleFavorite: () => void
  isCollapsed?: boolean
  isReorderMode?: boolean
}

export function SortableItem({
  id,
  subreddit,
  isSelected,
  onDelete,
  onToggleFavorite,
  isCollapsed = false,
  isReorderMode = false,
}: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id,
      disabled: !isReorderMode,
    })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  if (isCollapsed) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className='flex items-center justify-center'
      >
        <Link
          href={`/r/${subreddit.name}`}
          className={cn(
            buttonVariants({ variant: isSelected ? 'secondary' : 'ghost' }),
            'w-10 h-10 rounded-lg'
          )}
          title={`r/${subreddit.name}`}
        >
          {subreddit.iconUrl ? (
            <Image
              width={20}
              height={20}
              src={subreddit.iconUrl}
              alt={`r/${subreddit.name} icon`}
              className='w-6 h-6 rounded-full'
            />
          ) : (
            subreddit.name.charAt(0).toUpperCase()
          )}
        </Link>
      </div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className='flex items-center justify-between group'
    >
      <div className='flex items-center flex-1'>
        {isReorderMode && (
          <Button
            variant='ghost'
            size='icon'
            className='cursor-grab'
            {...attributes}
            {...listeners}
          >
            <GripVertical className='h-4 w-4' />
          </Button>
        )}
        <Link
          href={`/r/${subreddit.name}`}
          className={cn(
            buttonVariants({ variant: isSelected ? 'secondary' : 'ghost' }),
            'flex-1 justify-start font-normal gap-2'
          )}
        >
          {subreddit.iconUrl ? (
            <Image
              width={20}
              height={20}
              src={subreddit.iconUrl}
              alt={`r/${subreddit.name} icon`}
              className='w-5 h-5 rounded-full'
            />
          ) : (
            <div className='w-5 h-5 rounded-full bg-accent flex items-center justify-center text-xs'>
              r/
            </div>
          )}
          r/{subreddit.name}
        </Link>
      </div>

      {isReorderMode && (
        <div
          className={
            'flex opacity-0 group-hover:opacity-100 transition-opacity opacity-100'
          }
        >
          <Button
            variant='ghost'
            size='icon'
            onClick={onToggleFavorite}
            className={subreddit.isFavorite ? 'text-yellow-500' : ''}
          >
            {subreddit.isFavorite ? (
              <StarOff className='h-4 w-4' />
            ) : (
              <Star className='h-4 w-4' />
            )}
          </Button>
          <Button variant='ghost' size='icon' onClick={onDelete}>
            <Trash2 className='h-4 w-4' />
          </Button>
        </div>
      )}
    </div>
  )
}
