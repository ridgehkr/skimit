'use client'

import { SavedSubreddit } from '@/lib/subreddits'
import { SortableItem } from './sortable-item'
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'
import { ChevronDown, ChevronRight, MoreVertical } from 'lucide-react'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

interface SubredditSectionProps {
  title: string
  subreddits: SavedSubreddit[]
  onDelete: (subreddit: string) => void
  onToggleFavorite: (name: string) => void
  isCollapsed?: boolean
  isEditMode?: boolean
}

export function SubredditSection({
  title,
  subreddits,
  onDelete,
  onToggleFavorite,
  isCollapsed = false,
  isEditMode = false,
}: SubredditSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const pathname = usePathname()

  if (!subreddits?.length) {
    return null
  }

  const items = (
    <div className='space-y-1'>
      {subreddits.map((subreddit) => (
        <SortableItem
          key={subreddit.name}
          id={subreddit.name}
          subreddit={subreddit}
          isSelected={pathname.startsWith(`/r/${subreddit.name}`)}
          onDelete={() => onDelete(subreddit.name)}
          onToggleFavorite={() => onToggleFavorite(subreddit.name)}
          isCollapsed={isCollapsed}
          isReorderMode={isEditMode}
        />
      ))}
    </div>
  )

  if (isCollapsed) {
    return items
  }

  return (
    <div className='space-y-2'>
      <div className='flex items-center justify-between px-2'>
        <Button
          variant='ghost'
          size='sm'
          className='p-0 h-6 font-medium text-muted-foreground hover:text-foreground'
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <ChevronDown className='h-4 w-4 mr-1' />
          ) : (
            <ChevronRight className='h-4 w-4 mr-1' />
          )}
          {title}
        </Button>
      </div>

      {isExpanded && <div className='pl-2'>{items}</div>}
    </div>
  )
}
