'use client'

import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Divide } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDesktopNav } from '@/store/nav'
import { SubredditMenu } from '@/components/menu/subreddit-menu'
import { SiteMeta } from '@/components/menu/site-meta'
import { Separator } from '@/components/ui/separator'

/**
 * The desktop-only sidebar
 *
 * @param param0
 * @returns
 */
export function Sidebar() {
  const { isOpen, toggleNav } = useDesktopNav()

  return (
    <div
      className={cn(
        'z-20 hidden md:flex h-[calc(100vh-4rem)] flex-col fixed left-0 top-16 bottom-0 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300',
        isOpen ? 'w-[300px]' : 'w-[60px]'
      )}
    >
      <Button
        variant='ghost'
        size='icon'
        className='absolute -right-4 top-[1.1rem] h-8 w-8 rounded-full border bg-background shadow-md z-20'
        onClick={() => toggleNav()}
      >
        {!isOpen ? (
          <ChevronRight className='h-4 w-4' />
        ) : (
          <ChevronLeft className='h-4 w-4' />
        )}
      </Button>

      <div
        className={cn(
          'relative z-10 flex flex-col h-full transition-all duration-300 ease-in-out overflow-clip p-4',
          isOpen ? 'opacity-100' : 'opacity-0'
        )}
      >
        <SubredditMenu />

        <Separator className='my-4' />

        <SiteMeta />
      </div>
    </div>
  )
}
