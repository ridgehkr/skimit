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
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import debounce from 'lodash/debounce'
import { useQuery } from '@tanstack/react-query'
import { useSubredditStore, SavedSubreddit } from '@/store/subreddits'
import { useRouter } from 'next/navigation'

interface SubredditSearchProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

interface SubredditSuggestion {
  name: string
  subscribers: number
  icon_img?: string
}

const fetchAutocompleteSuggestions = async (
  query: string,
  limit = 10,
  subreddits: SavedSubreddit[] = []
): Promise<SubredditSuggestion[]> => {
  if (!query.trim()) {
    return []
  }

  const response = await fetch(
    `https://www.reddit.com/api/subreddit_autocomplete_v2.json?query=${query}&raw_json=1&include_over_18=true`
  )
  const data = await response.json()
  return (
    data.data.children
      .map((child: any) => ({
        name: child.data.display_name,
        subscribers: child.data.subscribers,
        icon_img: child.data.icon_img,
      }))

      // filter out subreddit suggestions that are already saved
      .filter(
        (suggestion: SubredditSuggestion) =>
          !subreddits.find(
            (saved: SavedSubreddit) =>
              saved.name?.toLowerCase() === suggestion.name?.toLowerCase()
          )
      )

      .slice(0, limit)
  )
}

export function SubredditSearch({ isOpen, setIsOpen }: SubredditSearchProps) {
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [debouncedSearchString, setDebouncedSearchString] = useState('')
  const router = useRouter()

  const handleSubredditSearchSubmit = (subredditName: string) => {
    setIsOpen(false)

    // redirect to newly-loaded subreddit
    router.push(`/r/${subredditName}`)
  }

  const debouncedSetSearchString = useCallback(
    debounce((value: string) => {
      setDebouncedSearchString(value)
    }, 500),
    []
  )

  const handleSearchInputChange = (value: string) => {
    debouncedSetSearchString(value)
  }

  const { subreddits, addSubreddit } = useSubredditStore()

  const {
    data: suggestions = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['subreddit-suggestions', debouncedSearchString],
    queryFn: () =>
      fetchAutocompleteSuggestions(debouncedSearchString, 10, subreddits),
    enabled: !!debouncedSearchString,
    staleTime: 30000,
  })

  useEffect(() => {
    if (!open) {
      setSelectedIndex(-1)
    }
  }, [open, setSelectedIndex])

  /**
   * Select a subreddit from the suggestions list
   * @param {string} value - The name of the subreddit
   */
  const handleSelect = (value: string) => {
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

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
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

  const formatSubscribers = (count: number) => {
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
          <CommandEmpty>
            {isLoading ? (
              <div className='flex items-center justify-center py-6'>
                <Loader2 className='h-4 w-4 animate-spin' />
              </div>
            ) : (
              'No subreddits found.'
            )}
          </CommandEmpty>
          {suggestions.length > 0 && (
            <CommandGroup>
              {suggestions.map((suggestion, index) => (
                <CommandItem
                  key={`${suggestion.name}-${index}`}
                  value={suggestion.name}
                  onSelect={handleSelect}
                  className={cn(
                    'flex items-center gap-2 py-3',
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
