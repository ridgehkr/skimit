'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

interface PostDetailLoadingProps {
  onBack: () => void
}

export function PostDetailLoading({ onBack }: PostDetailLoadingProps) {
  return (
    <div className='space-y-4'>
      <Button variant='ghost' onClick={onBack} className='mb-4 ml-1'>
        <ArrowLeft className='h-4 w-4 mr-1' />
        Back
      </Button>

      <Card>
        <CardHeader className='space-y-4 pb-6 p-4'>
          {/* Title and metadata loading state */}
          <div className='space-y-2'>
            <Skeleton className='h-8 w-3/4' />
            <div className='flex items-center gap-4'>
              <Skeleton className='h-4 w-32' />
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-4 w-28' />
            </div>
          </div>

          {/* Media placeholder */}
          <Skeleton className='h-[200px] w-full rounded-lg' />
        </CardHeader>
      </Card>

      {/* Comments section */}
      <div className='mt-8'>
        <h2 className='text-xl font-semibold mb-4'>Comments</h2>
        <div className='space-y-4'>
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className='p-4'>
                <div className='space-y-2'>
                  <div className='flex items-center gap-2'>
                    <Skeleton className='h-4 w-32' />
                    <Skeleton className='h-4 w-24' />
                  </div>
                  <Skeleton className='h-16 w-full' />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
