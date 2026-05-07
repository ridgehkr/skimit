'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { SiGithub as GitHub } from '@icons-pack/react-simple-icons'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className='min-h-screen p-4 pt-20 md:pt-24 max-w-2xl mx-auto'>
      <div className='flex items-center justify-between mb-6'>
        <Link href='/'>
          <Button variant='ghost'>
            <ArrowLeft className='h-4 w-4 mr-2' />
            Home
          </Button>
        </Link>

        <Button variant='outline' asChild>
          <a
            href='https://github.com/ridgehkr/skimit'
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center gap-x-2'
          >
            <GitHub className='h-4 w-4' />
            <span>GitHub</span>
          </a>
        </Button>
      </div>

      <div className='space-y-6'>
        <Card>
          <CardHeader>
            <CardTitle className='text-2xl'>About SkimIt</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4 pb-6 prose'>
            <p>
              Skimit is an open-source, read-only, quieter way to browse Reddit. Built for simplicity and without ads, distractions, or engagement prompts.
            </p>

            <ul className='space-y-2 list-disc pl-5'>
              <li>
                <strong>Read-Only:</strong> No voting, commenting, or posting,
                just browsing.
              </li>
              <li>
                <strong>Minimal & Fast:</strong> Lightweight and free of
                bloated UI features.
              </li>
              <li>
                <strong>Ad-Free & Open-Source:</strong> No ads, no tracking, and
                open for community contributions.
              </li>
              <li>
                <strong>Privacy-Focused:</strong> No data collection or tracking, just a
                direct way to read Reddit.
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className='text-center my-6 space-y-4'>
        <p className='text-sm prose'>
          Built and maintained by{' '}
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
