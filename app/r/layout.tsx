'use client'

import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { useRouter } from 'next/navigation'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const router = useRouter()

  // Only render after first client-side mount to prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null // Return null on server-side and first render
  }

  return (
    <div className='min-h-screen flex flex-col'>
      <Sidebar
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
        selectedSubreddit={''}
        onSubredditChange={setSearchInput}
        searchInput={searchInput}
        onSearch={(subreddit) => router.push(`/r/${subreddit}`)}
        onCollapse={setSidebarCollapsed}
      />

      <main
        className={`flex-1 transition-all duration-300 p-4 ${
          sidebarCollapsed ? 'md:ml-[60px]' : 'md:ml-[300px]'
        }`}
      >
        {children}
      </main>
    </div>
  )
}
