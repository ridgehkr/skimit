'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'

interface PostDetailErrorProps {
  message: string
  onBack: () => void
}

export function PostDetailError({ message, onBack }: PostDetailErrorProps) {
  return (
    <div className='py-8'>
      <Button variant='ghost' onClick={onBack} className='mb-4'>
        <ArrowLeft className='h-4 w-4 mr-2' />
        Back to Posts
      </Button>
      <Card>
        <CardContent className='p-8'>
          <div className='text-center text-destructive dark:text-destructive-foreground'>
            <p className='text-lg font-medium'>{message}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
