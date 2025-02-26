'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Github } from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className='min-h-screen p-4 pt-20 md:pt-24 max-w-2xl mx-auto'>
      <Link href='/'>
        <Button variant='ghost' className='mb-6'>
          <ArrowLeft className='h-4 w-4 mr-2' />
          Back to SkimIt
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className='text-2xl'>About</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4 pb-6'>
          <p>
            SkimIt is an open-source Reddit client that provides a clean and
            simple way to browse Reddit without all the extra noise. See it live
            at{' '}
            <a href='https://skimit.app' className='underline'>
              skimit.app
            </a>
            .
          </p>

          {/* <Separator /> */}

          <p className='text-sm'>
            Built by{' '}
            <a
              href='https://calebpierce.dev'
              target='_blank'
              rel='noopener noreferrer'
              className='font-medium text-primary underline'
            >
              Caleb Pierce
            </a>
          </p>
        </CardContent>
      </Card>

      <div className='text-center p-4 mt-6'>
        <Button variant='outline' asChild>
          <a
            href='https://github.com/ridgehkr/skimit'
            target='_blank'
            rel='noopener noreferrer'
            className='gap-2'
          >
            <Github className='h-4 w-4' />
            View on GitHub
          </a>
        </Button>
      </div>
    </div>
  )
}
