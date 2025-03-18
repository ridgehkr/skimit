'use client'

import { useEffect, useState, KeyboardEvent, useCallback } from 'react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import debounce from 'lodash/debounce'
import { useSubredditStore } from '@/store/subreddits'
import { useRouter } from 'next/navigation'
import { useAutocompleteSuggestions } from '@/lib/reddit'
import { type SubredditSuggestion } from '@/types/reddit'

interface SubredditSearchProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

/**
 * Displays a modal for searching for and adding new subreddits to the saved subreddits list.
 */
export function SubredditSearch({ isOpen, setIsOpen }: SubredditSearchProps) {
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [debouncedSearchString, setDebouncedSearchString] = useState('')
  const { subreddits, addSubreddit, removeSubreddit } = useSubredditStore()
  const router = useRouter()

  // subreddit autocomplete suggestions
  const { data: suggestions = [], isLoading } = useAutocompleteSuggestions(
    debouncedSearchString,
    subreddits
  )

  // when the search modal is closed, reset the search suggestion selected index
  useEffect(() => {
    if (!open) {
      setSelectedIndex(-1)
    }
  }, [open, setSelectedIndex])

  /**
   * Add a subreddit to the saved subreddits list and redirect to it
   *
   * @param subredditName - The name of the subreddit to save (does not include the /r/ prefix)
   * @return {void}
   */
  const handleSubredditSearchSubmit = (subredditName: string) => {
    setIsOpen(false)

    // notify the user
    toast('Subreddit Saved', {
      description: `/r/${subredditName} has been added to saved subreddits.`,
      action: {
        label: 'View',
        onClick: () => router.push(`/r/${subredditName}`),
      },
    })
  }

  /**
   * Debounce the search input to avoid excessive API calls
   * @param {string} value - The current value of the search input
   * @returns {void}
   */
  const debouncedSetSearchString = useCallback(
    debounce((value: string) => {
      setDebouncedSearchString(value)
    }, 500),
    []
  )

  /**
   * Handle search input change with debouncing
   *
   * @param value - The current value of the search input
   * @returns {void}
   */
  const handleSearchInputChange = (value: string) => {
    debouncedSetSearchString(value)
  }

  /**
   * Select a subreddit from the suggestions list
   * @param {string} value - The name of the subreddit
   */
  const handleSelect = (value: string) => {
    console.log({ suggestions })

    const selectedSubreddit = suggestions.find(
      (s: SubredditSuggestion) => s.name.toLowerCase() === value.toLowerCase()
    )
    if (selectedSubreddit) {
      // Save the subreddit with its icon
      addSubreddit({
        name: selectedSubreddit.name,
        iconUrl: selectedSubreddit.icon_img,
      })

      // Update the parent component
      handleSubredditSearchSubmit(selectedSubreddit.name)
    }
  }

  /**
   * Handle keyboard up, down, and selection navigation for the search suggestions list
   *
   * @param {KeyboardEvent<HTMLDivElement>} e - The keyboard event
   */
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > -1 ? prev - 1 : prev))
    } else if (e.key === 'Enter' && selectedIndex > -1) {
      e.preventDefault()
      handleSelect(suggestions[selectedIndex].name)
    }
  }

  /**
   * Format the subscriber count for a more readable appearance
   *
   * @param {number} count - The number of subscribers
   * @returns {string} - The formatted subscriber count
   */
  const formatSubscribers = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M subscribers`
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K subscribers`
    }
    return `${count} subscribers`
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Add Subreddit</DialogTitle>
        </DialogHeader>
        <Command
          className='rounded-lg border shadow-md'
          onKeyDown={handleKeyDown}
        >
          <CommandInput
            placeholder='Search subreddits…'
            onValueChange={handleSearchInputChange}
          />

          {!!debouncedSearchString && (
            <CommandEmpty>
              {isLoading ? (
                <div className='flex items-center justify-center py-6'>
                  <Loader2 className='h-4 w-4 animate-spin' />
                </div>
              ) : (
                'No subreddits found.'
              )}
            </CommandEmpty>
          )}

          {suggestions.length > 0 && (
            <CommandGroup>
              {suggestions.map((suggestion, index) => (
                <CommandItem
                  key={`${suggestion.name}-${index}`}
                  value={suggestion.name}
                  onSelect={handleSelect}
                  className={cn(
                    'flex items-center gap-2 py-3 cursor-pointer',
                    selectedIndex === index && 'bg-accent'
                  )}
                >
                  {suggestion.icon_img ? (
                    <Image
                      width={24}
                      height={24}
                      src={suggestion.icon_img}
                      alt={`/r/${suggestion.name} icon`}
                      className='w-6 h-6 rounded-full'
                    />
                  ) : (
                    <div className='w-6 h-6 rounded-full bg-accent flex items-center justify-center'>
                      r/
                    </div>
                  )}
                  <div className='flex flex-col'>
                    <span className='font-medium'>r/{suggestion.name}</span>
                    <span className='text-xs text-muted-foreground'>
                      {formatSubscribers(suggestion.subscribers)}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </Command>
      </DialogContent>
    </Dialog>
  )
}
