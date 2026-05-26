import { cn } from '@/lib/utils'
import type { Metadata } from 'next'
import { Geist, Instrument_Serif, Mr_De_Haviland } from 'next/font/google'
import { siteConfig } from '@/lib/site-config'
import './stylesheets/globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const instrumentSerif = Instrument_Serif({
  variable: '--font-instrument-serif',
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
})

const mrDeHaviland = Mr_De_Haviland({
  variable: '--font-mr-de-haviland',
  subsets: ['latin'],
  weight: '400',
})

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang='en'
      className='scroll-smooth'
      data-primary-color={siteConfig.theme.primaryColor}
    >
      <body
        className={cn(
          geistSans.variable,
          instrumentSerif.variable,
          mrDeHaviland.variable,
          'relative isolate scroll-smooth font-sans antialiased',
          siteConfig.theme.primaryColor === 'purple'
            ? 'bg-mauve-100/82'
            : siteConfig.theme.primaryColor === 'brown'
              ? 'bg-taupe-100'
              : 'bg-olive-100'
        )}
      >
        {children}
      </body>
    </html>
  )
}
