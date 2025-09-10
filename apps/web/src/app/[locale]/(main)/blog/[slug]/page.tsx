import type { Metadata, ResolvingMetadata } from 'next'
import type { Article, WithContext } from 'schema-dts'

import { i18n } from '@repo/i18n/config'
import { setRequestLocale } from '@repo/i18n/server'
import { allPosts } from 'content-collections'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import CommentSection from '@/components/comment-section'
import Mdx from '@/components/mdx'
import { MY_NAME, OG_IMAGE_HEIGHT, OG_IMAGE_TYPE, OG_IMAGE_WIDTH } from '@/lib/constants'
import { getBaseUrl } from '@/utils/get-base-url'
import { getLocalizedPath } from '@/utils/get-localized-path'

import Footer from './footer'
import Header from './header'
import LikeButton from './like-button'
import MobileTableOfContents from './mobile-table-of-contents'
import ProgressBar from './progress-bar'
import TableOfContents from './table-of-contents'

export const generateStaticParams = (): Array<{ slug: string; locale: string }> => {
  return allPosts.map((post) => ({
    slug: post.slug,
    locale: post.locale
  }))
}

export const generateMetadata = async (
  props: PageProps<'/[locale]/blog/[slug]'>,
  parent: ResolvingMetadata
): Promise<Metadata> => {
  const { params } = props
  const { slug, locale } = await params

  const post = allPosts.find((p) => p.slug === slug && p.locale === locale)

  if (!post) return {}

  const ISOPublishedTime = new Date(post.date).toISOString()
  const ISOModifiedTime = new Date(post.modifiedTime).toISOString()
  const { openGraph = {}, twitter = {} } = await parent
  const fullSlug = `/blog/${slug}`
  const url = getLocalizedPath({ slug: fullSlug, locale, absolute: false })

  return {
    title: post.title,
    description: post.summary,
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
      title: post.title,
      description: post.summary,
      publishedTime: ISOPublishedTime,
      modifiedTime: ISOModifiedTime,
      authors: getBaseUrl(),
      images: [
        {
          url: `/blog/${post.slug}/og-image.png`,
          width: OG_IMAGE_WIDTH,
          height: OG_IMAGE_HEIGHT,
          alt: post.title,
          type: OG_IMAGE_TYPE
        }
      ]
    },
    twitter: {
      ...twitter,
      title: post.title,
      description: post.summary,
      images: [
        {
          url: `/blog/${post.slug}/og-image.png`,
          width: OG_IMAGE_WIDTH,
          height: OG_IMAGE_HEIGHT,
          alt: post.title
        }
      ]
    }
  }
}

const Page = async (props: PageProps<'/[locale]/blog/[slug]'>) => {
  const { params } = props
  const { slug, locale } = await params
  setRequestLocale(locale)

  const post = allPosts.find((p) => p.slug === slug && p.locale === locale)
  const url = getLocalizedPath({ slug: `/blog/${slug}`, locale, absolute: true })

  if (!post) {
    notFound()
  }

  const jsonLd: WithContext<Article> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    name: post.title,
    description: post.summary,
    url,
    datePublished: post.date,
    dateModified: post.modifiedTime,
    image: `${getBaseUrl()}/blog/${post.slug}/og-image.png`,
    author: {
      '@type': 'Person',
      name: MY_NAME,
      url: getBaseUrl()
    },
    publisher: {
      '@type': 'Person',
      name: MY_NAME,
      url: getBaseUrl()
    }
  }

  return (
    <>
      {/* eslint-disable-next-line @eslint-react/dom/no-dangerously-set-innerhtml -- Safe */}
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Header post={post} />

      <div className='mt-8 flex flex-col justify-between lg:flex-row'>
        <article className='w-full lg:w-[670px]'>
          <Mdx code={post.code} />
        </article>
        <aside className='lg:max-w-[270px] lg:min-w-[270px]'>
          <div className='sticky top-24'>
            {post.toc.length > 0 && <TableOfContents toc={post.toc} />}
            <LikeButton slug={slug} />
          </div>
        </aside>
      </div>
      <ProgressBar />

      {post.toc.length > 0 && <MobileTableOfContents toc={post.toc} />}
      <Footer post={post} />

      <Suspense>
        <CommentSection slug={slug} />
      </Suspense>
    </>
  )
}

export default Page
