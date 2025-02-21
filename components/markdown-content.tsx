'use client'

import { marked } from 'marked'
import { gfmHeadingId } from 'marked-gfm-heading-id'
import { mangle } from 'marked-mangle'
import { useMemo } from 'react'

interface MarkdownContentProps {
  content?: string
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  const htmlContent = useMemo(() => {
    if (!content) return ''

    marked.use(
      gfmHeadingId({
        prefix: 'skimit-',
      })
    )

    marked.use(mangle())

    // Configure marked for safe rendering
    marked.setOptions({
      breaks: true, // Convert \n to <br>
      gfm: true, // GitHub Flavored Markdown
      silent: true, // Don't throw on invalid markdown
    })

    // Custom renderer to handle image URLs
    const renderer = new marked.Renderer()
    renderer.image = ({
      href,
      title,
      text,
    }: {
      href: string
      title: string | null
      text: string
    }) => {
      try {
        // Decode URL-encoded characters
        const decodedHref = decodeURIComponent(href || '')

        // Handle special cases like Giphy URLs
        if (decodedHref.includes('giphy|')) {
          const giphyId = decodedHref.split('|')[1]
          return `<img src="https://media.giphy.com/media/${giphyId}/giphy.gif" alt="${
            text || ''
          }" class="rounded-md max-w-full" />`
        }

        // Regular images
        return `<img src="${decodedHref}" alt="${
          text || ''
        }" class="rounded-md max-w-full" />`
      } catch (error) {
        console.error('Error processing image URL:', error)
        return '' // Return empty string if URL processing fails
      }
    }

    try {
      return marked(content, { renderer })
    } catch (error) {
      console.error('Error parsing markdown:', error)
      return ''
    }
  }, [content])

  if (!htmlContent) return null

  return (
    <div
      className='prose dark:prose-invert max-w-none text-sm [&>*:first-child]:mt-0 [&>*:last-child]:mb-0'
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  )
}
