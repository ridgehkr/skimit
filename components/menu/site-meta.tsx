import Link from 'next/link'
import { Separator } from '@/components/ui/separator'

/**
 * Displays the site meta information including the theme toggle, about link, and GitHub link.
 */
export function SiteMeta() {
  const currentYear = new Date().getFullYear()

  return (
    <div className='flex flex-col gap-4'>
      <div className='text-xs text-muted-foreground'>
        <nav className='mb-2'>
          <ul className='flex h-4 items-center space-x-4'>
            <Link href='/about' className='hover:underline '>
              About
            </Link>

            <Separator
              orientation='vertical'
              className='dark:bg-muted-foreground'
            />

            <Link
              href='https://github.com/ridgehkr/skimit'
              className='hover:underline'
            >
              GitHub
            </Link>
          </ul>
        </nav>

        <p>&copy; {currentYear} SkimIt. All rights reserved.</p>
      </div>
    </div>
  )
}
