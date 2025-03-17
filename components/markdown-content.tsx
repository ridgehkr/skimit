'use client'

import { marked, type Tokens } from 'marked'
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

    // apply tailwind classes to tables
    renderer.table = (token: Tokens.Table) => {
      const { header, rows } = token

      const headerRow = header
        .map(
          (cell: Tokens.TableCell) =>
            `<th class="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">${marked(
              cell.text
            )}</th>`
        )
        .join('')

      const bodyRows = rows
        .map(
          (row) =>
            `<tr class="m-0 border-t p-0 even:bg-muted">${row
              .map(
                (cell: Tokens.TableCell) =>
                  `<td class="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">${marked(
                    cell.text
                  )}</td>`
              )
              .join('')}</tr>`
        )
        .join('')
      return `
      <div class="my-6 w-full overflow-y-auto">
        <table class="w-full">
          <thead>
            <tr class="m-0 border-t p-0 even:bg-muted">${headerRow}</tr>
          </thead>
          <tbody>${bodyRows}</tbody>
        </table>
      </div>
      `
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
      className='prose dark:prose-invert max-w-none text-sm [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 prose-a:underline [&_a]:underline'
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  )
}
