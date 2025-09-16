import type { Metadata } from 'next'
import type { WebSite, WithContext } from 'schema-dts'

import { i18n } from '@repo/i18n/config'
import { getTranslations, setRequestLocale } from '@repo/i18n/server'

import AboutMe from '@/components/home/about-me'
import GetInTouch from '@/components/home/get-in-touch'
import Hero from '@/components/home/hero'
import LatestArticles from '@/components/home/latest-articles'
import SelectedProjects from '@/components/home/selected-projects'
import JsonLd from '@/components/json-ld'
import {
  MY_NAME,
  SITE_FACEBOOK_URL,
  SITE_GITHUB_URL,
  SITE_INSTAGRAM_URL,
  SITE_X_URL,
  SITE_YOUTUBE_URL
} from '@/lib/constants'
import { allPosts, allProjects } from '@/lib/content'
import { createMetadata } from '@/lib/metadata'
import { getBaseUrl } from '@/utils/get-base-url'
import { getLocalizedPath } from '@/utils/get-localized-path'

export const generateStaticParams = (): Array<{ locale: string }> => {
  return i18n.locales.map((locale) => ({ locale }))
}

export const generateMetadata = async (props: PageProps<'/[locale]'>): Promise<Metadata> => {
  const { params } = props
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'metadata' })
  const description = t('site-description')

  return createMetadata({
    root: true,
    title: MY_NAME,
    description,
    locale,
    ogImagePathname: '/og-image.png'
  })
}

const Page = async (props: PageProps<'/[locale]'>) => {
  const { params } = props
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('metadata')

  const url = getLocalizedPath({ locale })

  const jsonLd: WithContext<WebSite> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': url,
    name: MY_NAME,
    description: t('site-description'),
    url,
    publisher: {
      '@type': 'Person',
      name: MY_NAME,
      url: getBaseUrl(),
      sameAs: [SITE_FACEBOOK_URL, SITE_INSTAGRAM_URL, SITE_X_URL, SITE_GITHUB_URL, SITE_YOUTUBE_URL]
    },
    copyrightYear: new Date().getFullYear(),
    dateCreated: '2022-02-01T00:00:00Z',
    dateModified: new Date().toISOString(),
    inLanguage: locale
  }

  const filteredPosts = allPosts
    .toSorted((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
    .filter((post) => post.locale === locale)
    .slice(0, 2)

  const filteredProjects = allProjects.filter((project) => project.selected && project.locale === locale)

  return (
    <>
      <JsonLd json={jsonLd} />
      <Hero />
      <SelectedProjects projects={filteredProjects} />
      <AboutMe />
      <LatestArticles posts={filteredPosts} />
      <GetInTouch />
    </>
  )
}

export default Page
