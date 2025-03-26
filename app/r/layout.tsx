'use client'

import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { useDesktopNav } from '@/store/nav'
import { Toaster } from '@/components/ui/sonner'
import { AppHeader } from '@/components/layout/app-header'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)

  const { isOpen } = useDesktopNav()

  useEffect(() => {
    setMounted(true)
  }, [setMounted])

  if (!mounted) {
    return null
  }

  return (
    <>
      <AppHeader />
      <div className='min-h-screen flex flex-col'>
        <Sidebar />

        <main
          className={`flex-1 transition-all duration-300 p-4 z-10 ${
            !isOpen ? 'md:ml-[60px]' : 'md:ml-[300px]'
          }`}
        >
          {children}
        </main>
        <Toaster />
      </div>
    </>
  )
}
