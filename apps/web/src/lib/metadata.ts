import type { Metadata } from 'next'

import { deepmerge } from '@fastify/deepmerge'
import { i18n } from '@repo/i18n/config'

import { getBaseUrl } from '@/utils/get-base-url'
import { getLocalizedPath } from '@/utils/get-localized-path'

import { MY_NAME, OG_IMAGE_HEIGHT, OG_IMAGE_TYPE, OG_IMAGE_WIDTH } from './constants'

type Options = {
  root?: boolean
  pathname?: string
  ogImagePathname: string
  title: string
  description: string
  locale: string
} & Partial<Metadata>

export const createMetadata = (options: Options): Metadata => {
  const { root = false, pathname, title, description, locale, ogImagePathname, ...rest } = options
  const baseUrl = getBaseUrl()

  const resolvedTitle = root ? title : `${title} | ${MY_NAME}`
  const resolvedOGImageUrl = getLocalizedPath({ locale, pathname: ogImagePathname })

  const currentUrl = getLocalizedPath({ locale, pathname })

  return deepmerge()(
    {
      title: resolvedTitle,
      description,
      creator: MY_NAME,
      manifest: `${baseUrl}/site.webmanifest`,
      alternates: {
        canonical: currentUrl,
        languages: {
          ...Object.fromEntries(i18n.locales.map((l) => [l, getLocalizedPath({ locale: l, pathname })])),
          'x-default': getLocalizedPath({ locale: i18n.defaultLocale, pathname })
        }
      },
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
        url: baseUrl
      },
      openGraph: {
        title: resolvedTitle,
        description,
        url: currentUrl,
        siteName: MY_NAME,
        type: 'website',
        locale,
        images: [
          {
            url: resolvedOGImageUrl,
            width: OG_IMAGE_WIDTH,
            height: OG_IMAGE_HEIGHT,
            type: OG_IMAGE_TYPE
          }
        ]
      },
      twitter: {
        card: 'summary_large_image',
        siteId: '1152256803746377730',
        creator: '@nelsonlaidev',
        creatorId: '1152256803746377730'
      },
      icons: {
        icon: {
          rel: 'icon',
          type: 'image/x-icon',
          url: `${baseUrl}/favicon.ico`
        },
        apple: [
          {
            type: 'image/png',
            url: `${baseUrl}/apple-touch-icon.png`,
            sizes: '180x180'
          }
        ],
        other: [
          {
            rel: 'icon',
            type: 'image/svg+xml',
            url: `${baseUrl}/favicon.svg`,
            sizes: 'any'
          },
          {
            rel: 'icon',
            type: 'image/png',
            url: `${baseUrl}/favicon-16x16.png`,
            sizes: '16x16'
          },
          {
            rel: 'icon',
            type: 'image/png',
            url: `${baseUrl}/favicon-32x32.png`,
            sizes: '32x32'
          }
        ]
      }
    },
    rest
  )
}
