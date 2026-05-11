'use client'

import { useTheme } from 'next-themes'
import { Switch } from '@/components/ui/switch'
import { useMounted } from '@/hooks/use-mounted'

export function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme()
  const mounted = useMounted()

  const currentTheme = theme === 'system' ? systemTheme : theme
  const isDark = currentTheme === 'dark'

  if (!mounted) return null

  return (
    <div className='flex items-center space-x-2'>
      <Switch
        id='theme-toggle'
        checked={isDark}
        onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
        aria-label='Toggle theme'
      />
    </div>
  )
}
