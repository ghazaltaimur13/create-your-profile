import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { AppShell } from '@/components/AppShell'

import { Providers } from './providers'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Portfolio Studio',
  description: 'Build and export a polished portfolio PDF.',
  icons: [{ rel: 'icon', url: '/vite.svg' }],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  )
}
