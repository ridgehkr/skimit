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
import {
  AArrowDown,
  ChevronLeft,
  ChevronRight,
  Edit2,
  GripVertical,
  Plus,
  Star,
  StarOff,
  Trash2,
} from 'lucide-react'
import { SubredditSearch } from '@/components/sidebar/subreddit-search'
import { ThemeToggle } from './theme-toggle'
// import { LoginButton } from '@/components/auth/login-button'
import { SavedSubreddit, subredditStorage } from '@/lib/subreddits'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { usePathname } from 'next/navigation'
import { useNavStore } from '@/store/nav'

interface SortableItemProps {
  id: string
  subreddit: SavedSubreddit
  isSelected: boolean
  onToggleFavorite: () => void
  onDelete: () => void
  isCollapsed?: boolean
  isEditMode?: boolean
}

function SortableItem({
  id,
  subreddit,
  isSelected,
  onToggleFavorite,
  onDelete,
  isCollapsed = false,
  isEditMode = false,
}: SortableItemProps) {
  const { closeNav } = useNavStore()

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  if (isCollapsed) {
    return (
      <div ref={setNodeRef} style={style}>
        <Link
          href={`/r/${subreddit.name}`}
          className={cn(
            buttonVariants({ variant: isSelected ? 'secondary' : 'ghost' }),
            'w-10 h-10 rounded-lg'
          )}
          onClick={closeNav}
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
        {isEditMode && (
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
          onClick={closeNav}
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

      {isEditMode && (
        <div className='flex'>
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

interface SidebarProps {
  onCollapse: (collapsed: boolean) => void
}

export function Sidebar({ onCollapse }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [subreddits, setSubreddits] = useState<SavedSubreddit[]>(() =>
    subredditStorage.getSubreddits()
  )

  // mobile nav state from store
  const { isOpen, closeNav } = useNavStore()

  const router = useRouter()

  const pathname = usePathname()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  )

  const handleCollapse = (collapsed: boolean) => {
    setIsTransitioning(true)
    setIsCollapsed(collapsed)
    onCollapse(collapsed)
    setTimeout(() => {
      setIsTransitioning(false)
    }, 300)
  }

  const handleSort = () => {
    const sorted = subredditStorage.sortAlphabetically()
    setSubreddits(sorted)
  }

  const handleDeleteSubreddit = (name: string) => {
    subredditStorage.remove(name)
    setSubreddits(subredditStorage.getSubreddits())
  }

  const handleToggleFavorite = (name: string) => {
    subredditStorage.toggleFavorite(name)
    setSubreddits(subredditStorage.getSubreddits())
  }

  const handleSubredditSearchSubmit = (subredditName: string) => {
    setShowSearchModal(false)

    // Immediately update the subreddits list after adding a new one
    setSubreddits(subredditStorage.getSubreddits())

    // redirect to newly-loaded subreddit
    router.push(`/r/${subredditName}`)
  }

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

    subredditStorage.saveSubreddits(updated)
    setSubreddits(updated)
  }

  // subreddits marked as "favorite"
  const favorites = subreddits
    .filter((s) => s.isFavorite)
    .sort((a, b) => a.order - b.order)

  // subreddits not marked as "favorite"
  const others = subreddits
    .filter((s) => !s.isFavorite)
    .sort((a, b) => a.order - b.order)

  const hasSaved = subreddits.length > 0

  const renderSubredditList = (items: SavedSubreddit[]) => {
    if (isCollapsed) {
      return items.map((subreddit) => (
        <SortableItem
          key={subreddit.name}
          id={subreddit.name}
          subreddit={subreddit}
          isSelected={pathname.startsWith(`/r/${subreddit.name}`)}
          onToggleFavorite={() => handleToggleFavorite(subreddit.name)}
          onDelete={() => handleDeleteSubreddit(subreddit.name)}
          isCollapsed={true}
          isEditMode={isEditMode}
        />
      ))
    }

    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((s) => s.name)}
          strategy={verticalListSortingStrategy}
        >
          {items.map((subreddit) => (
            <SortableItem
              key={subreddit.name}
              id={subreddit.name}
              subreddit={subreddit}
              isSelected={pathname.startsWith(`/r/${subreddit.name}`)}
              onToggleFavorite={() => handleToggleFavorite(subreddit.name)}
              onDelete={() => handleDeleteSubreddit(subreddit.name)}
              isEditMode={isEditMode}
            />
          ))}
        </SortableContext>
      </DndContext>
    )
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
          {hasSaved && (
            <div className='grid gap-2 w-full mb-6'>
              <div className='flex gap-2 items-center justify-between w-full'>
                <h2 className='text-xl font-semibold'>Subreddits</h2>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setShowSearchModal(true)}
                  className='rounded-sm'
                >
                  <Plus className='h-4 w-4' />
                  Add
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className='flex flex-col grow'>
          <ScrollArea
            className={cn(
              'h-[400px] px-1 -mx-1 flex-1 pb-4',
              !hasSaved ? 'flex flex-col justify-center' : ''
            )}
          >
            <div
              className={cn(
                'transition-all duration-300',
                isCollapsed ? 'opacity-0' : 'opacity-100'
              )}
            >
              {!hasSaved && (
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

              {favorites.length > 0 && (
                <div className='mb-6'>
                  <h3 className='text-sm font-medium text-muted-foreground mb-2'>
                    Favorites
                  </h3>
                  <div className='space-y-1'>
                    {renderSubredditList(favorites)}
                  </div>
                </div>
              )}

              <div>
                {!isCollapsed && others.length > 0 && (
                  <h3 className='text-sm font-medium text-muted-foreground mb-2'>
                    All Subreddits
                  </h3>
                )}
                <div className='space-y-1'>{renderSubredditList(others)}</div>
              </div>
            </div>
          </ScrollArea>

          {hasSaved && (
            <div className='flex mt-auto items-center justify-between gap-4'>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setIsEditMode(!isEditMode)}
                className={cn(
                  'text-muted-foreground hover:text-foreground',
                  isEditMode && 'text-primary hover:text-primary'
                )}
              >
                <Edit2 className='h-4 w-4 mr-2' />
                {isEditMode ? 'Done' : 'Edit'}
              </Button>
              {!isCollapsed && isEditMode && subreddits.length >= 2 && (
                <Button
                  variant='link'
                  size='sm'
                  onClick={handleSort}
                  className='text-muted-foreground hover:text-foreground p-0 h-auto'
                >
                  <AArrowDown className='h-4 w-4 mr-2' />
                  Sort A-Z
                </Button>
              )}
            </div>
          )}
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
          <div className='flex items-center justify-between'>
            <ThemeToggle />
          </div>
          <div className='text-xs text-muted-foreground space-y-2'>
            <div className='flex gap-3'>
              <a href='/about' className='hover:underline'>
                About
              </a>
            </div>
            <p>&copy; 2025 SkimIt. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  )

  /**
   * Render the mobile sidebar
   */
  return (
    <>
      <Sheet
        open={isOpen}
        onOpenChange={(open: boolean) => !open && closeNav()}
      >
        <SheetContent side='right' className='w-[300px] sm:w-[400px] p-0'>
          <div className='flex flex-col h-full'>
            <SheetHeader className='p-4 border-b'>
              <SheetTitle className='text-left'>Menu</SheetTitle>
              {/* <div className='mt-4'>
                <LoginButton />
              </div> */}
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
        onOpenChange={setShowSearchModal}
        open={showSearchModal}
        onSearchSubmit={handleSubredditSearchSubmit}
      />
    </>
  )
}
