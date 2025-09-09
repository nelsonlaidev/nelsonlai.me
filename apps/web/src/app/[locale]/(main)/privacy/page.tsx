import type { Metadata, ResolvingMetadata } from 'next'

import { i18n } from '@repo/i18n/config'
import { getTranslations, setRequestLocale } from '@repo/i18n/server'
import { allPages } from 'content-collections'
import { notFound } from 'next/navigation'

import Mdx from '@/components/mdx'
import PageTitle from '@/components/page-title'
import { OG_IMAGE_HEIGHT, OG_IMAGE_TYPE, OG_IMAGE_WIDTH } from '@/lib/constants'
import { getLocalizedPath } from '@/utils/get-localized-path'

export const generateStaticParams = (): Array<Awaited<PageProps<'/[locale]/privacy'>['params']>> => {
  return i18n.locales.map((locale) => ({ locale }))
}

export const generateMetadata = async (
  props: PageProps<'/[locale]/privacy'>,
  parent: ResolvingMetadata
): Promise<Metadata> => {
  const { params } = props
  const { locale } = await params
  const { openGraph = {}, twitter = {} } = await parent
  const t = await getTranslations({ locale, namespace: 'privacy' })
  const title = t('title')
  const description = t('description')

  const slug = '/privacy'
  const url = getLocalizedPath({ slug, locale, absolute: false })

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(i18n.locales.map((l) => [l, getLocalizedPath({ slug, locale: l, absolute: false })])),
        'x-default': getLocalizedPath({ slug, locale: i18n.defaultLocale, absolute: false })
      }
    },
    openGraph: {
      ...openGraph,
      url,
      title,
      description,
      images: [
        {
          url: '/privacy/og-image.png',
          width: OG_IMAGE_WIDTH,
          height: OG_IMAGE_HEIGHT,
          alt: title,
          type: OG_IMAGE_TYPE
        }
      ]
    },
    twitter: {
      ...twitter,
      title,
      description,
      images: [
        {
          url: '/privacy/og-image.png',
          width: OG_IMAGE_WIDTH,
          height: OG_IMAGE_HEIGHT,
          alt: title
        }
      ]
    }
  }
}

const Page = async (props: PageProps<'/[locale]/privacy'>) => {
  const { params } = props
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations()
  const title = t('privacy.title')
  const description = t('privacy.description')
  const page = allPages.find((p) => p.slug === 'privacy' && p.locale === locale)

  if (!page) {
    return notFound()
  }

  const { code } = page

  return (
    <>
      <PageTitle title={title} description={description} />
      <Mdx code={code} />
    </>
  )
}

export default Page
