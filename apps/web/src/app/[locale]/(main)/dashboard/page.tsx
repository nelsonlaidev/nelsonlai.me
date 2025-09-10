import type { Metadata, ResolvingMetadata } from 'next'
import type { WebPage, WithContext } from 'schema-dts'

import { i18n } from '@repo/i18n/config'
import { getTranslations, setRequestLocale } from '@repo/i18n/server'

import PageTitle from '@/components/page-title'
import { MY_NAME } from '@/lib/constants'
import { getBaseUrl } from '@/utils/get-base-url'
import { getLocalizedPath } from '@/utils/get-localized-path'

import Stats from './stats'

export const generateStaticParams = (): Array<{ locale: string }> => {
  return i18n.locales.map((locale) => ({ locale }))
}

export const generateMetadata = async (
  props: PageProps<'/[locale]/dashboard'>,
  parent: ResolvingMetadata
): Promise<Metadata> => {
  const { params } = props
  const { locale } = await params
  const { openGraph = {}, twitter = {} } = await parent
  const t = await getTranslations({ locale, namespace: 'dashboard' })
  const title = t('title')
  const description = t('description')
  const slug = '/dashboard'
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
      description
    },
    twitter: {
      ...twitter,
      title,
      description
    }
  }
}

const Page = async (props: PageProps<'/[locale]/dashboard'>) => {
  const { params } = props
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations()
  const title = t('dashboard.title')
  const description = t('dashboard.description')
  const url = getLocalizedPath({ slug: '/dashboard', locale, absolute: true })

  const jsonLd: WithContext<WebPage> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url,
    isPartOf: {
      '@type': 'WebSite',
      name: MY_NAME,
      url: getBaseUrl()
    }
  }

  return (
    <>
      {/* eslint-disable-next-line @eslint-react/dom/no-dangerously-set-innerhtml -- Safe */}
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageTitle title={title} description={description} />
      <Stats />
    </>
  )
}

export default Page
