'use client'

import { Sidebar } from '@/components/sidebar'
import { useDesktopNav } from '@/store/nav'
import { Toaster } from '@/components/ui/sonner'
import { AppHeader } from '@/components/layout/app-header'
import { useMounted } from '@/hooks/use-mounted'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const mounted = useMounted()
  const { isOpen } = useDesktopNav()

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
            !isOpen ? 'lg:ml-15' : 'md:ml-62 lg:ml-75'
          }`}
        >
          {children}
        </main>
        <Toaster />
      </div>
    </>
  )
}
