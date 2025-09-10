import type { Metadata } from 'next'
import type { WebSite, WithContext } from 'schema-dts'

import { i18n } from '@repo/i18n/config'
import { getTranslations, setRequestLocale } from '@repo/i18n/server'

import AboutMe from '@/components/home/about-me'
import GetInTouch from '@/components/home/get-in-touch'
import Hero from '@/components/home/hero'
import LatestArticles from '@/components/home/latest-articles'
import SelectedProjects from '@/components/home/selected-projects'
import {
  MY_NAME,
  SITE_FACEBOOK_URL,
  SITE_GITHUB_URL,
  SITE_INSTAGRAM_URL,
  SITE_KEYWORDS,
  SITE_X_URL,
  SITE_YOUTUBE_URL
} from '@/lib/constants'
import { getBaseUrl } from '@/utils/get-base-url'
import { getLocalizedPath } from '@/utils/get-localized-path'

export const generateStaticParams = (): Array<{ locale: string }> => {
  return i18n.locales.map((locale) => ({ locale }))
}

export const generateMetadata = async (props: PageProps<'/[locale]'>): Promise<Metadata> => {
  const { params } = props
  const { locale } = await params
  const slug = ''

  return {
    alternates: {
      canonical: getLocalizedPath({ slug, locale, absolute: false }),
      languages: {
        ...Object.fromEntries(i18n.locales.map((l) => [l, getLocalizedPath({ slug, locale: l, absolute: false })])),
        'x-default': getLocalizedPath({ slug, locale: i18n.defaultLocale, absolute: false })
      }
    }
  }
}

const Page = async (props: PageProps<'/[locale]'>) => {
  const { params } = props
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('metadata')

  const url = getLocalizedPath({ slug: '', locale, absolute: true })

  const jsonLd: WithContext<WebSite> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: MY_NAME,
    description: t('site-description'),
    url,
    author: {
      '@type': 'Person',
      name: MY_NAME,
      url: getBaseUrl(),
      sameAs: [SITE_FACEBOOK_URL, SITE_INSTAGRAM_URL, SITE_X_URL, SITE_GITHUB_URL, SITE_YOUTUBE_URL]
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': getBaseUrl()
    },
    inLanguage: locale,
    copyrightYear: new Date().getFullYear(),
    keywords: SITE_KEYWORDS,
    dateCreated: '2020-12-05',
    dateModified: new Date().toISOString()
  }

  return (
    <>
      {/* eslint-disable-next-line @eslint-react/dom/no-dangerously-set-innerhtml -- Safe */}
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero />
      <SelectedProjects />
      <AboutMe />
      <LatestArticles />
      <GetInTouch />
    </>
  )
}

export default Page
