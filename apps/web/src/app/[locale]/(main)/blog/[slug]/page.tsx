import type { Metadata, ResolvingMetadata } from 'next'
import type { Article, WithContext } from 'schema-dts'

import { i18n } from '@repo/i18n/config'
import { setRequestLocale } from '@repo/i18n/server'
import { allPosts } from 'content-collections'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import CommentSection from '@/components/comment-section'
import Mdx from '@/components/mdx'
import { SITE_NAME } from '@/lib/constants'
import { getBaseUrl } from '@/utils/get-base-url'
import { getLocalizedPath } from '@/utils/get-localized-path'

import Footer from './footer'
import Header from './header'
import LikeButton from './like-button'
import MobileTableOfContents from './mobile-table-of-contents'
import ProgressBar from './progress-bar'
import TableOfContents from './table-of-contents'

type PageProps = {
  params: Promise<{
    slug: string
    locale: string
  }>
}

export const generateStaticParams = (): Array<{ slug: string; locale: string }> => {
  return allPosts.map((post) => ({
    slug: post.slug,
    locale: post.locale
  }))
}

export const generateMetadata = async (props: PageProps, parent: ResolvingMetadata): Promise<Metadata> => {
  const { params } = props
  const { slug, locale } = await params

  const post = allPosts.find((p) => p.slug === slug && p.locale === locale)

  if (!post) return {}

  const { date, modifiedTime, title, summary } = post

  const ISOPublishedTime = new Date(date).toISOString()
  const ISOModifiedTime = new Date(modifiedTime).toISOString()
  const { openGraph = {}, twitter = {} } = await parent
  const fullSlug = `/blog/${slug}`
  const url = getLocalizedPath({ slug: fullSlug, locale, absolute: false })

  return {
    title: title,
    description: summary,
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(
          i18n.locales.map((l) => [l, getLocalizedPath({ slug: fullSlug, locale: l, absolute: false })])
        ),
        'x-default': getLocalizedPath({
          slug: fullSlug,
          locale: i18n.defaultLocale,
          absolute: false
        })
      }
    },
    openGraph: {
      ...openGraph,
      url,
      type: 'article',
      title: title,
      description: summary,
      publishedTime: ISOPublishedTime,
      modifiedTime: ISOModifiedTime,
      authors: getBaseUrl(),
      images: [
        {
          url: `/og/${slug}`,
          width: 1200,
          height: 630,
          alt: title,
          type: 'image/png'
        }
      ]
    },
    twitter: {
      ...twitter,
      title: title,
      description: summary,
      images: [
        {
          url: `/og/${slug}`,
          width: 1200,
          height: 630,
          alt: title
        }
      ]
    }
  }
}

const Page = async (props: PageProps) => {
  const { params } = props
  const { slug, locale } = await params
  setRequestLocale(locale)

  const post = allPosts.find((p) => p.slug === slug && p.locale === locale)
  const url = getLocalizedPath({ slug: `/blog/${slug}`, locale, absolute: true })

  if (!post) {
    notFound()
  }

  const { title, summary, date, modifiedTime, code, toc } = post

  const jsonLd: WithContext<Article> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    name: title,
    description: summary,
    url,
    datePublished: date,
    dateModified: modifiedTime,
    image: `${getBaseUrl()}/og/${slug}`,
    author: {
      '@type': 'Person',
      name: SITE_NAME,
      url: getBaseUrl()
    },
    publisher: {
      '@type': 'Person',
      name: SITE_NAME,
      url: getBaseUrl()
    }
  }

  return (
    <>
      {/* eslint-disable-next-line @eslint-react/dom/no-dangerously-set-innerhtml -- safe */}
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Header post={post} />

      <div className='mt-8 flex flex-col justify-between lg:flex-row'>
        <article className='w-full lg:w-[670px]'>
          <Mdx code={code} />
        </article>
        <aside className='lg:max-w-[270px] lg:min-w-[270px]'>
          <div className='sticky top-24'>
            {toc.length > 0 && <TableOfContents toc={toc} />}
            <LikeButton slug={slug} />
          </div>
        </aside>
      </div>
      <ProgressBar />

      {toc.length > 0 && <MobileTableOfContents toc={toc} />}
      <Footer post={post} />

      <Suspense>
        <CommentSection slug={slug} />
      </Suspense>
    </>
  )
}

export default Page
