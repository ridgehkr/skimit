'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
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

      <div className='space-y-6'>
        <Card>
          <CardHeader>
            <CardTitle className='text-2xl'>About</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4 pb-6'>
            <p>
              SkimIt is an open-source Reddit client that provides a clean and
              simple way to browse Reddit content and comments without all the
              extra noise.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-2xl'>Contributing</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4 pb-6'>
            <p>
              SkimIt is an open source project, and we welcome your
              contributions! Get started by checking out the project on{' '}
              <a
                href='https://github.com/ridgehkr/skimit'
                target='_blank'
                rel='noopener noreferrer'
                className='underline'
              >
                GitHub
              </a>
              .
            </p>
          </CardContent>
        </Card>
      </div>

      <div className='text-center p-4 mt-6 space-y-4'>
        <p className='text-sm'>
          SkimIt is built and maintained by{' '}
          <a
            href='https://calebpierce.dev'
            rel='noopener noreferrer'
            className='font-medium text-primary underline'
          >
            Caleb Pierce
          </a>
          .
        </p>
      </div>
    </div>
  )
}
