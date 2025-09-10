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
import { MY_NAME, SITE_KEYWORDS } from '@/lib/constants'
import { getBaseUrl } from '@/utils/get-base-url'

import Providers from '../providers'

export const generateStaticParams = (): Array<{ locale: string }> => {
  return i18n.locales.map((locale) => ({ locale }))
}

export const generateMetadata = async (props: LayoutProps<'/[locale]'>): Promise<Metadata> => {
  const { params } = props
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'metadata' })

  return {
    metadataBase: new URL(getBaseUrl()),
    title: {
      default: MY_NAME,
      template: `%s | ${MY_NAME}`
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
      name: MY_NAME,
      url: getBaseUrl()
    },
    manifest: '/favicons/site.webmanifest',
    twitter: {
      card: 'summary_large_image',
      title: MY_NAME,
      description: t('site-description'),
      site: '@nelsonlaidev',
      siteId: '1152256803746377730',
      creator: '@nelsonlaidev',
      creatorId: '1152256803746377730',
      images: [
        {
          url: '/images/og-image.png',
          width: 1200,
          height: 630,
          alt: t('site-description')
        }
      ]
    },
    keywords: SITE_KEYWORDS,
    creator: MY_NAME,
    openGraph: {
      url: getBaseUrl(),
      type: 'website',
      title: MY_NAME,
      siteName: MY_NAME,
      description: t('site-description'),
      locale,
      images: [
        {
          url: '/images/og-image.png',
          width: 1200,
          height: 630,
          alt: t('site-description'),
          type: 'image/png'
        }
      ]
    },
    icons: {
      icon: {
        rel: 'icon',
        type: 'image/x-icon',
        url: '/favicons/favicon.ico'
      },
      apple: [
        {
          type: 'image/png',
          url: '/favicons/apple-touch-icon.png',
          sizes: '180x180'
        }
      ],
      other: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          url: '/favicons/favicon.svg',
          sizes: 'any'
        },
        {
          rel: 'icon',
          type: 'image/png',
          url: '/favicons/favicon-16x16.png',
          sizes: '16x16'
        },
        {
          rel: 'icon',
          type: 'image/png',
          url: '/favicons/favicon-32x32.png',
          sizes: '32x32'
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

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
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
      className={cn(geistSans.variable, geistMono.variable)}
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
