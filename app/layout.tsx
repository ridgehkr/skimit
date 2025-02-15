import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
// import { Toaster } from 'sonner'
import { AppHeader } from '@/components/layout/app-header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SkimIt - Reddit without the noise',
  description: 'Get Reddit content without all the Reddit fluff.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <AppHeader />
          {children}
          {/* <Toaster
            theme='system'
            className='[&_.success-icon]:!text-green-500'
          /> */}
        </ThemeProvider>
      </body>
    </html>
  )
}
