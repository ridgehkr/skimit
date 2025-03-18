'use client'

import { Switch } from '@/components/ui/switch'
import { useSubredditStore } from '@/store/subreddits'

/**
 * Displays a toggle switch for changing the application theme between light and dark modes.
 */
export function NSFWToggle() {
  const { setAllowNSFW, allowNSFW } = useSubredditStore()

  return (
    <Switch
      id='theme-toggle'
      checked={allowNSFW}
      onCheckedChange={() => setAllowNSFW(!allowNSFW)}
      aria-label='Allow NSFW content'
    />
  )
}
