import type { Metadata, ResolvingMetadata } from 'next'
import type { Blog, WithContext } from 'schema-dts'

import { i18n } from '@repo/i18n/config'
import { getTranslations, setRequestLocale } from '@repo/i18n/server'
import { allPosts } from 'content-collections'

import FilteredPosts from '@/components/filtered-posts'
import PageTitle from '@/components/page-title'
import { MY_NAME } from '@/lib/constants'
import { getBaseUrl } from '@/utils/get-base-url'
import { getLocalizedPath } from '@/utils/get-localized-path'

export const generateStaticParams = (): Array<{ locale: string }> => {
  return i18n.locales.map((locale) => ({ locale }))
}

export const generateMetadata = async (
  props: PageProps<'/[locale]/blog'>,
  parent: ResolvingMetadata
): Promise<Metadata> => {
  const { params } = props
  const { locale } = await params
  const { openGraph = {}, twitter = {} } = await parent
  const t = await getTranslations({ locale, namespace: 'blog' })
  const title = t('title')
  const description = t('description')
  const slug = '/blog'
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

const Page = async (props: PageProps<'/[locale]/blog'>) => {
  const { params } = props
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('blog')
  const title = t('title')
  const description = t('description')
  const url = getLocalizedPath({ slug: '/blog', locale, absolute: true })

  const posts = allPosts
    .toSorted((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
    .filter((post) => post.locale === locale)

  const jsonLd: WithContext<Blog> = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': url,
    name: title,
    description,
    url,
    author: {
      '@type': 'Person',
      name: MY_NAME,
      url: getBaseUrl()
    },
    blogPost: allPosts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: `${url}/${post.slug}`,
      datePublished: post.date,
      dateModified: post.modifiedTime
    }))
  }

  return (
    <>
      {/* eslint-disable-next-line @eslint-react/dom/no-dangerously-set-innerhtml -- safe */}
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageTitle title={title} description={description} />
      <FilteredPosts posts={posts} />
    </>
  )
}

export default Page
