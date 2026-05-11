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
import { formatNumber } from '@/lib/utils'
import Image from 'next/image'
import debounce from 'lodash/debounce'
import { useSubredditStore } from '@/store/subreddits'
import { useRouter } from 'next/navigation'
import { useAutocompleteSuggestions } from '@/hooks/use-autocomplete'
import { type SubredditSuggestion } from '@/types/reddit'

interface SubredditSearchProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

export function SubredditSearch({ isOpen, setIsOpen }: SubredditSearchProps) {
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [debouncedSearchString, setDebouncedSearchString] = useState('')
  const { subreddits, addSubreddit } = useSubredditStore()
  const router = useRouter()

  const allowNSFW = useSubredditStore((state) => state.allowNSFW)

  const { data: suggestions = [], isLoading } = useAutocompleteSuggestions(
    debouncedSearchString,
    subreddits,
    10,
    allowNSFW
  )

  useEffect(() => {
    if (!isOpen) setSelectedIndex(-1)
  }, [isOpen])

  const handleSubredditSearchSubmit = (subredditName: string) => {
    setIsOpen(false)
    toast('Subreddit Saved', {
      description: `r/${subredditName} added to your saved subreddits.`,
      action: {
        label: 'View',
        onClick: () => router.push(`/r/${subredditName}`),
      },
    })
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

  const handleSelect = (value: string) => {
    const selectedSubreddit = suggestions.find(
      (s: SubredditSuggestion) => s.name.toLowerCase() === value.toLowerCase()
    )
    if (selectedSubreddit) {
      addSubreddit({
        name: selectedSubreddit.name,
        iconUrl: selectedSubreddit.icon_img,
      })
      handleSubredditSearchSubmit(selectedSubreddit.name)
    }
  }

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
                    <div className='flex items-center gap-2'>
                      <span className='font-medium'>r/{suggestion.name}</span>
                      {suggestion.over18 && (
                        <span className='text-xs text-muted-foreground inline-flex items-center gap-2'>
                          {'•'}
                          <span className='text-red-500 font-bold'>NSFW</span>
                        </span>
                      )}
                    </div>
                    <span className='text-xs text-muted-foreground'>
                      {formatNumber(suggestion.subscribers)} subscribers
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
