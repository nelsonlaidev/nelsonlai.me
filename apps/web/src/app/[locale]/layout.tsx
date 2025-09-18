import type { Viewport } from 'next'

import '@/styles/globals.css'

import { hasLocale, NextIntlClientProvider } from '@repo/i18n/client'
import { i18n } from '@repo/i18n/config'
import { routing } from '@repo/i18n/routing'
import { setRequestLocale } from '@repo/i18n/server'
import { cn } from '@repo/utils'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Geist, Geist_Mono, Noto_Sans_SC, Noto_Sans_TC } from 'next/font/google'
import { notFound } from 'next/navigation'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

import Analytics from '@/components/analytics'
import Hello from '@/components/hello'
import SignInDialog from '@/components/sign-in-dialog'

import Providers from '../providers'

export const generateStaticParams = (): Array<{ locale: string }> => {
  return i18n.locales.map((locale) => ({ locale }))
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ]
}

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

const notoSansTC = Noto_Sans_TC({
  variable: '--font-noto-sans-tc',
  subsets: ['latin'],
  display: 'swap'
})

const notoSansSC = Noto_Sans_SC({
  variable: '--font-noto-sans-sc',
  subsets: ['latin'],
  display: 'swap'
})

const Layout = async (props: LayoutProps<'/[locale]'>) => {
  const { children, params } = props
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)

  return (
    <html
      lang={locale}
      className={cn(geistSans.variable, geistMono.variable, notoSansTC.variable, notoSansSC.variable)}
      data-scroll-behavior='smooth'
      suppressHydrationWarning
    >
      <body className='relative flex min-h-screen flex-col'>
        <NuqsAdapter>
          <Providers>
            <NextIntlClientProvider>
              <Hello />
              {children}
              <Analytics />
              <SignInDialog />
            </NextIntlClientProvider>
          </Providers>
        </NuqsAdapter>
        <SpeedInsights />
      </body>
    </html>
  )
}

export default Layout
