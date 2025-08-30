import type { Metadata, ResolvingMetadata } from 'next'
import type { AboutPage, WithContext } from 'schema-dts'

import { i18n } from '@repo/i18n/config'
import { getTranslations, setRequestLocale } from '@repo/i18n/server'
import { allPages } from 'content-collections'
import { notFound } from 'next/navigation'

import Mdx from '@/components/mdx'
import PageTitle from '@/components/page-title'
import {
  SITE_FACEBOOK_URL,
  SITE_GITHUB_URL,
  SITE_INSTAGRAM_URL,
  SITE_NAME,
  SITE_X_URL,
  SITE_YOUTUBE_URL
} from '@/lib/constants'
import { getBaseUrl } from '@/utils/get-base-url'
import { getLocalizedPath } from '@/utils/get-localized-path'

type PageProps = {
  params: Promise<{
    locale: string
  }>
}

export const generateStaticParams = (): Array<{ locale: string }> => {
  return i18n.locales.map((locale) => ({ locale }))
}

export const generateMetadata = async (props: PageProps, parent: ResolvingMetadata): Promise<Metadata> => {
  const { locale } = await props.params
  const previousOpenGraph = (await parent).openGraph ?? {}
  const previousTwitter = (await parent).twitter ?? {}
  const t = await getTranslations({ locale, namespace: 'about' })
  const title = t('title')
  const description = t('description')
  const slug = '/about'
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
      ...previousOpenGraph,
      url,
      type: 'profile',
      title,
      description
    },
    twitter: {
      ...previousTwitter,
      title,
      description
    }
  }
}

const Page = async (props: PageProps) => {
  const { locale } = await props.params
  setRequestLocale(locale)
  const t = await getTranslations()
  const title = t('about.title')
  const description = t('about.description')
  const url = getLocalizedPath({ slug: '/about', locale, absolute: true })
  const page = allPages.find((p) => p.slug === 'about' && p.locale === locale)

  const jsonLd: WithContext<AboutPage> = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: title,
    description,
    url,
    mainEntity: {
      '@type': 'Person',
      name: SITE_NAME,
      description: t('metadata.site-description'),
      url: getBaseUrl(),
      sameAs: [SITE_FACEBOOK_URL, SITE_INSTAGRAM_URL, SITE_X_URL, SITE_GITHUB_URL, SITE_YOUTUBE_URL]
    }
  }

  if (!page) {
    return notFound()
  }

  const { code } = page

  return (
    <>
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageTitle title={title} description={description} />
      <Mdx code={code} />
    </>
  )
}

export default Page
