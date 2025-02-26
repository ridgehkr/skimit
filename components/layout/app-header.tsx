'use client'

import { LibraryBig, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavStore } from '@/store/nav'
// import { LoginButton } from '@/components/auth/login-button'

export function AppHeader() {
  const { openNav } = useNavStore()

  return (
    <header className='h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 relative md:sticky top-0 left-0 right-0 z-50'>
      <div className='h-full mx-auto px-4 flex items-center justify-between'>
        <span className='flex items-center gap-2'>
          <LibraryBig className='h-6 w-6 text-primary' />
          <h1 className='text-base md:text-lg font-semibold'>SkimIt</h1>
        </span>

        <div className='flex items-center gap-4'>
          {/* Desktop login button */}
          {/* <div className='hidden md:block'>
            <LoginButton />
          </div> */}

          {/* Mobile menu button */}
          <Button variant='ghost' className='md:hidden' onClick={openNav}>
            <span>Subreddits</span>
            <Menu className='h-6 w-6' />
          </Button>
        </div>
      </div>
    </header>
  )
}
