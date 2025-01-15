'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import {
  AArrowDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  Check,
  Edit2,
} from 'lucide-react'
import { SubredditList } from './subreddit-list'
import { SubredditSearch } from './subreddit-search'
import { ThemeToggle } from './theme-toggle'
import { LoginButton } from '@/components/auth/login-button'
import { SavedSubreddit } from '@/lib/subreddits'
import { cn } from '@/lib/utils'

interface SidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  subreddits: SavedSubreddit[]
  onSelectSubreddit: (subreddit: string) => void
  onDeleteSubreddit: (subreddit: string) => void
  selectedSubreddit: string
  onUpdateSubreddits: (subreddits: SavedSubreddit[]) => void
  onSubredditChange: (value: string) => void
  searchInput: string
  onSearch: (subredditName: string) => void
  onCollapse: (collapsed: boolean) => void
}

export function Sidebar({
  open,
  onOpenChange,
  subreddits,
  onSelectSubreddit,
  onDeleteSubreddit,
  selectedSubreddit,
  onUpdateSubreddits,
  onSubredditChange,
  searchInput,
  onSearch,
  onCollapse,
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editedSubreddits, setEditedSubreddits] = useState<SavedSubreddit[]>([])

  const handleCollapse = (collapsed: boolean) => {
    setIsTransitioning(true)
    setIsCollapsed(collapsed)
    onCollapse(collapsed)
    // Reset the transitioning state after the animation completes
    setTimeout(() => {
      setIsTransitioning(false)
    }, 300) // Match this with the transition duration
  }

  const handleSort = () => {
    const sortedSubreddits = [
      ...(isEditMode ? editedSubreddits : subreddits),
    ].sort((a, b) => {
      if (a.isFavorite !== b.isFavorite) {
        return b.isFavorite ? 1 : -1
      }
      return a.name.localeCompare(b.name)
    })
    if (isEditMode) {
      setEditedSubreddits(sortedSubreddits)
    } else {
      onUpdateSubreddits(sortedSubreddits)
    }
  }

  const handleEditModeToggle = () => {
    if (isEditMode) {
      // Save changes
      onUpdateSubreddits(editedSubreddits)
      setIsEditMode(false)
    } else {
      // Enter edit mode
      setEditedSubreddits([...subreddits])
      setIsEditMode(true)
    }
  }

  const handleUpdateSubreddits = (updatedSubreddits: SavedSubreddit[]) => {
    if (isEditMode) {
      setEditedSubreddits(updatedSubreddits)
    } else {
      onUpdateSubreddits(updatedSubreddits)
    }
  }

  const sidebarContent = (
    <div className='flex flex-col h-full'>
      <div className='p-6 pl-4 flex flex-col grow'>
        <div
          className={cn(
            'transition-all duration-300',
            isTransitioning ? 'opacity-0' : 'opacity-100',
            isCollapsed && 'hidden'
          )}
        >
          <div className='grid gap-2 w-full mb-6'>
            <div className='flex gap-2 items-center justify-between w-full'>
              <h2 className='text-xl font-semibold'>Subreddits</h2>

              <Button
                variant='ghost'
                size='sm'
                onClick={() => setShowSearchModal(true)}
                className='rounded-sm ml-auto'
              >
                <Plus className='h-4 w-4 mr-2' />
                Add
              </Button>
            </div>
          </div>
        </div>

        <div className='flex flex-col grow'>
          <SubredditList
            subreddits={isEditMode ? editedSubreddits : subreddits}
            onSelect={(name) => {
              onSelectSubreddit(name)
              onOpenChange(false)
            }}
            onDelete={onDeleteSubreddit}
            selectedSubreddit={selectedSubreddit}
            onUpdateSubreddits={handleUpdateSubreddits}
            isCollapsed={isCollapsed}
            isReorderMode={isEditMode}
          />

          <div className='flex gap-2 mt-auto items-center'>
            <Button
              variant={'ghost'}
              size='sm'
              onClick={handleEditModeToggle}
              className={`rounded-sm ${isEditMode ? 'color-green-400' : ''}`}
            >
              {isEditMode ? (
                <>
                  <Check className='h-4 w-4 mr-2' />
                  <span>Save</span>
                </>
              ) : (
                <>
                  <Edit2 className='h-4 w-4 mr-2' />
                  <span>Edit</span>
                </>
              )}
            </Button>

            {!isCollapsed && subreddits.length >= 2 && isEditMode && (
              <Button
                variant='link'
                size='sm'
                onClick={handleSort}
                className='text-muted-foreground hover:text-foreground p-0 h-auto ml-auto'
              >
                <AArrowDown className='h-4 w-4 mr-2' />
                Sort A-Z
              </Button>
            )}
          </div>
        </div>
      </div>
      <div
        className={cn(
          'p-4 border-t transition-opacity duration-300',
          isTransitioning ? 'opacity-0' : 'opacity-100',
          isCollapsed && 'hidden'
        )}
      >
        <div className='space-y-4'>
          <div className='text-xs text-muted-foreground space-y-2'>
            <div className='flex gap-3'>
              <a href='/about' className='hover:underline'>
                About
              </a>
            </div>
            <p>&copy; 2025 SkimIt. All rights reserved.</p>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side='right' className='w-[300px] sm:w-[400px] p-0'>
          <div className='flex flex-col h-full'>
            <SheetHeader className='p-4 border-b'>
              <SheetTitle>Menu</SheetTitle>
              <div className='mt-4'>
                <LoginButton />
              </div>
            </SheetHeader>
            {sidebarContent}
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div
        className={cn(
          'hidden md:flex h-[calc(100vh-4rem)] flex-col fixed left-0 top-16 bottom-0 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300',
          isCollapsed ? 'w-[60px]' : 'w-[300px]'
        )}
      >
        <Button
          variant='ghost'
          size='icon'
          className='absolute -right-4 top-[1.1rem] h-8 w-8 rounded-full border bg-background shadow-md'
          onClick={() => handleCollapse(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRight className='h-4 w-4' />
          ) : (
            <ChevronLeft className='h-4 w-4' />
          )}
        </Button>
        {sidebarContent}
      </div>

      <SubredditSearch
        open={showSearchModal}
        onOpenChange={setShowSearchModal}
        subreddit={searchInput}
        onSubredditChange={onSubredditChange}
        onSearch={(name) => {
          onSearch(name)
          setShowSearchModal(false)
        }}
      />
    </>
  )
}
