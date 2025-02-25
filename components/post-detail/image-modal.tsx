'use client'

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { ExternalLink, X } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ImageModalProps {
  src: string
  alt: string
  redditUrl: string
}

export function ImageModal({ src, alt, redditUrl }: ImageModalProps) {
  const [open, setOpen] = useState(false)

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <div className='cursor-zoom-in'>
          <Image
            width={800}
            height={800}
            src={src}
            alt={alt}
            className='max-w-[800px] max-h-[800px] w-auto h-auto object-contain hover:opacity-95 transition-opacity'
          />
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent className='p-2 overflow-hidden max-w-[90vw] max-h-[90vh] sm:max-w-[90vw]'>
        <Button variant='link' asChild>
          <a
            href={redditUrl}
            target='_blank'
            rel='noopener noreferrer'
            className={cn(
              'flex items-center gap-2 text-sm absolute top-4 left-4 z-20'
            )}
          >
            <ExternalLink className='h-4 w-4' />
            View on Reddit
          </a>
        </Button>

        <div className='relative z-10'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => setOpen(false)}
            className='h-8 w-8 rounded-full absolute top-2 right-2 '
          >
            <X className='h-4 w-4' />
            <span className='sr-only'>Close</span>
          </Button>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className='w-full h-full object-contain max-h-[calc(95vh-8rem)]'
          />

          <div className='absolute bottom-[-1px] left-0 right-0 p-4 bg-background/80 backdrop-blur-sm flex flex-col align-center justify-center text-center gap-4'>
            <AlertDialogTitle className='text-md font-normal'>
              {alt}
            </AlertDialogTitle>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
