'use client'

import { useEffect, useState } from 'react'
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
import { SavedSubreddit, subredditStorage } from '@/lib/subreddits'

interface SubredditSearchProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  subreddit: string
  // onSubredditChange: (value: string) => void
  // onSearch: (subredditName: string) => void
}

interface SubredditSuggestion {
  name: string
  subscribers: number
  icon_img?: string
}

const fetchAutocompleteSuggestions = async (
  query: string,
  limit = 10
): Promise<SubredditSuggestion[]> => {
  if (!query.trim()) {
    return []
  }

  const savedSubreddits = subredditStorage.getSubreddits()

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
          !savedSubreddits.some(
            (saved: SavedSubreddit) =>
              saved.name.toLowerCase() === suggestion.name.toLowerCase()
          )
      )

      .slice(0, limit)
  )
}

export function SubredditSearch({
  open,
  onOpenChange,
  subreddit,
}: SubredditSearchProps) {
  const [selectedIndex, setSelectedIndex] = useState(-1)

  const debouncedFetch = debounce(fetchAutocompleteSuggestions, 300)

  const {
    data: suggestions = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['suggestions', subreddit],
    queryFn: () => fetchAutocompleteSuggestions(subreddit),
    enabled: !!subreddit,
    staleTime: 30000,
  })

  useEffect(() => {
    if (!open) {
      setSelectedIndex(-1)
      // onSubredditChange('') // Clear the input
    }
  }, [open, setSelectedIndex])

  const handleSelect = (value: string) => {
    // Find the selected subreddit from suggestions
    const selectedSubreddit = suggestions.find(
      (s: SubredditSuggestion) => s.name.toLowerCase() === value.toLowerCase()
    )
    if (selectedSubreddit) {
      // Save the subreddit with its icon
      subredditStorage.save(selectedSubreddit.name, selectedSubreddit.icon_img)

      // Update the parent component
      // onSubredditChange(selectedSubreddit.name)
      // onSearch(selectedSubreddit.name)

      // Close the dialog
      onOpenChange(false)
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!suggestions.length) return

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
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            value={subreddit}
            onValueChange={debouncedFetch}
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
                      alt={suggestion.name}
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
