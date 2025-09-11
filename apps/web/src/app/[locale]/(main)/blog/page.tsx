import type { Metadata } from 'next'
import type { CollectionPage, WithContext } from 'schema-dts'

import { i18n } from '@repo/i18n/config'
import { getTranslations, setRequestLocale } from '@repo/i18n/server'
import { allPosts } from 'content-collections'

import FilteredPosts from '@/components/filtered-posts'
import JsonLd from '@/components/json-ld'
import PageTitle from '@/components/page-title'
import { MY_NAME } from '@/lib/constants'
import { createMetadata } from '@/lib/metadata'
import { getBaseUrl } from '@/utils/get-base-url'
import { getLocalizedPath } from '@/utils/get-localized-path'

export const generateStaticParams = (): Array<{ locale: string }> => {
  return i18n.locales.map((locale) => ({ locale }))
}

export const generateMetadata = async (props: PageProps<'/[locale]/blog'>): Promise<Metadata> => {
  const { params } = props
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'blog' })
  const title = t('title')
  const description = t('description')

  return createMetadata({
    pathname: '/blog',
    title,
    description,
    locale,
    ogImagePathname: '/blog/og-image.png'
  })
}

const Page = async (props: PageProps<'/[locale]/blog'>) => {
  const { params } = props
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('blog')
  const title = t('title')
  const description = t('description')
  const url = getLocalizedPath({ locale, pathname: '/blog' })

  const posts = allPosts
    .filter((post) => post.locale === locale)
    .toSorted((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const jsonLd: WithContext<CollectionPage> = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': url,
    name: title,
    description,
    url,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: posts.map((post, index) => ({
        '@type': 'BlogPosting',
        headline: post.title,
        url: `${url}/${post.slug}`,
        datePublished: post.date,
        dateModified: post.modifiedTime,
        position: index + 1
      }))
    },
    isPartOf: {
      '@type': 'WebSite',
      name: MY_NAME,
      url: getBaseUrl()
    },
    inLanguage: locale
  }

  return (
    <>
      <JsonLd json={jsonLd} />
      <PageTitle title={title} description={description} />
      <FilteredPosts posts={posts} />
    </>
  )
}

export default Page
