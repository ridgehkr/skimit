'use client'

import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { ThemeToggle } from '@/components/menu/theme-toggle'
import { NSFWToggle } from '@/components/menu/nsfw-toggle'
import { SlidersHorizontal, HelpCircle } from 'lucide-react'

/**
 * Displays a toggle switch for displaying NSFW (Not Safe For Work) posts and subreddits.
 */
export function SettingsMenu() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='ghost'
          className='text-muted-foreground hover:text-foreground has-[>svg]:px-0 md:has-[>svg]:px-2.5 hover:text-primary focus-visible:text-primary'
        >
          <SlidersHorizontal />
          <span className='sr-only'>Settings</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-60' align='end'>
        <div className='grid gap-4'>
          <div className='flex justify-between items-center gap-4'>
            <h4 className='font-normal text-xs leading-none whitespace-nowrap'>
              Dark Mode
            </h4>

            <ThemeToggle />
          </div>

          <div className='flex justify-between items-center gap-4'>
            <h4 className='font-normal flex items-center gap-1 text-xs leading-none whitespace-nowrap'>
              NSFW Content
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className='ml-1 h-4 w-4 text-muted-foreground' />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Allow content for 18+ audiences</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </h4>

            <NSFWToggle />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
