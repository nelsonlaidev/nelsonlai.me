import type { Metadata } from 'next'
import type { BlogPosting, WithContext } from 'schema-dts'

import { setRequestLocale } from '@repo/i18n/server'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import CommentSection from '@/components/comment-section'
import JsonLd from '@/components/json-ld'
import Mdx from '@/components/mdx'
import { MY_NAME } from '@/lib/constants'
import { allPosts } from '@/lib/content'
import { createMetadata } from '@/lib/metadata'
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

export const generateMetadata = async (props: PageProps<'/[locale]/blog/[slug]'>): Promise<Metadata> => {
  const { params } = props
  const { slug, locale } = await params

  const post = allPosts.find((p) => p.slug === slug && p.locale === locale)

  if (!post) return {}

  return createMetadata({
    pathname: `/blog/${slug}`,
    title: post.title,
    description: post.summary,
    locale,
    ogImagePathname: `/blog/${post.slug}/og-image.png`,
    openGraph: {
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.modifiedTime
    }
  })
}

const Page = async (props: PageProps<'/[locale]/blog/[slug]'>) => {
  const { params } = props
  const { slug, locale } = await params
  setRequestLocale(locale)

  const post = allPosts.find((p) => p.slug === slug && p.locale === locale)
  const url = getLocalizedPath({ locale, pathname: `/blog/${slug}` })
  const baseUrl = getBaseUrl()

  if (!post) {
    notFound()
  }

  const jsonLd: WithContext<BlogPosting> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.summary,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    },
    image: `${baseUrl}/blog/${post.slug}/og-image.png`,
    datePublished: post.date,
    dateModified: post.modifiedTime,
    author: {
      '@type': 'Person',
      name: MY_NAME,
      url: baseUrl
    },
    publisher: {
      '@type': 'Person',
      name: MY_NAME,
      url: baseUrl
    },
    inLanguage: locale
  }

  return (
    <>
      <JsonLd json={jsonLd} />

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
