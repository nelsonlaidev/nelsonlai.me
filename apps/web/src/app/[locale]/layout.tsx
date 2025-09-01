import type { Metadata, Viewport } from 'next'

import '@/styles/globals.css'

import { hasLocale, NextIntlClientProvider } from '@repo/i18n/client'
import { i18n } from '@repo/i18n/config'
import { routing } from '@repo/i18n/routing'
import { getTranslations, setRequestLocale } from '@repo/i18n/server'
import { cn } from '@repo/utils'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Geist, Geist_Mono } from 'next/font/google'
import { notFound } from 'next/navigation'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

import Analytics from '@/components/analytics'
import Hello from '@/components/hello'
import SignInDialog from '@/components/sign-in-dialog'
import { SITE_KEYWORDS, SITE_NAME } from '@/lib/constants'
import { getBaseUrl } from '@/utils/get-base-url'

import Providers from '../providers'

type LayoutProps = {
  children: React.ReactNode
  params: Promise<{
    locale: string
  }>
}

export const generateStaticParams = (): Array<{ locale: string }> => {
  return i18n.locales.map((locale) => ({ locale }))
}

export const generateMetadata = async (props: LayoutProps): Promise<Metadata> => {
  const { params } = props
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'metadata' })

  return {
    metadataBase: new URL(getBaseUrl()),
    title: {
      default: t('site-title'),
      template: `%s | ${t('site-title')}`
    },
    description: t('site-description'),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    },
    authors: {
      name: 'Nelson Lai',
      url: getBaseUrl()
    },
    manifest: '/favicon/site.webmanifest',
    twitter: {
      card: 'summary_large_image',
      title: SITE_NAME,
      description: t('site-description'),
      site: '@nelsonlaidev',
      siteId: '1152256803746377730',
      creator: '@nelsonlaidev',
      creatorId: '1152256803746377730',
      images: [
        {
          url: '/images/og.png',
          width: 1200,
          height: 630,
          alt: t('site-description')
        }
      ]
    },
    keywords: SITE_KEYWORDS,
    creator: 'Nelson Lai',
    openGraph: {
      url: getBaseUrl(),
      type: 'website',
      title: t('site-title'),
      siteName: t('site-title'),
      description: t('site-description'),
      locale,
      images: [
        {
          url: '/images/og.png',
          width: 1200,
          height: 630,
          alt: t('site-description'),
          type: 'image/png'
        }
      ]
    },
    icons: {
      icon: '/favicon/favicon.svg',
      shortcut: '/favicon/favicon.svg',
      apple: [
        {
          url: '/favicon/apple-touch-icon.png',
          sizes: '180x180',
          type: 'image/png'
        }
      ],
      other: [
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '16x16',
          url: '/favicon/favicon-16x16.png'
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          url: '/favicon/favicon-32x32.png'
        }
      ]
    }
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ]
}

const fontSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans'
})

const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: '400'
})

const Layout = async (props: LayoutProps) => {
  const { children, params } = props
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)

  return (
    <html lang={locale} className={cn(fontSans.variable, fontMono.variable)} suppressHydrationWarning>
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
