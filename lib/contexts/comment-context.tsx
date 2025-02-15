'use client'

import { createContext, useContext, useState, useCallback } from 'react'

interface CommentContextType {
  collapsedComments: Set<string>
  toggleComment: (id: string) => void
  collapseAll: () => void
  expandAll: () => void
  isCollapsed: (id: string) => boolean
}

const CommentContext = createContext<CommentContextType | null>(null)

export function CommentProvider({ children }: { children: React.ReactNode }) {
  const [collapsedComments, setCollapsedComments] = useState<Set<string>>(
    new Set()
  )

  const toggleComment = useCallback(
    (id: string) => {
      setCollapsedComments((prev) => {
        const next = new Set(prev)
        if (next.has(id)) {
          next.delete(id)
        } else {
          next.add(id)
        }
        return next
      })
    },
    [setCollapsedComments]
  )

  const collapseAll = useCallback(() => {
    const allComments = document.querySelectorAll('[data-comment-id]')
    const ids = Array.from(allComments).map(
      (el) => el.getAttribute('data-comment-id') || ''
    )
    setCollapsedComments(new Set(ids))
  }, [setCollapsedComments])

  const expandAll = useCallback(() => {
    setCollapsedComments(new Set())
  }, [setCollapsedComments])

  const isCollapsed = useCallback(
    (id: string) => {
      return collapsedComments.has(id)
    },
    [collapsedComments]
  )

  return (
    <CommentContext.Provider
      value={{
        collapsedComments,
        toggleComment,
        collapseAll,
        expandAll,
        isCollapsed,
      }}
    >
      {children}
    </CommentContext.Provider>
  )
}

export function useComments() {
  const context = useContext(CommentContext)
  if (!context) {
    throw new Error('useComments must be used within a CommentProvider')
  }
  return context
}
