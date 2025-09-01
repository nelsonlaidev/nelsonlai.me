import type { Metadata, ResolvingMetadata } from 'next'
import type { SoftwareApplication, WithContext } from 'schema-dts'

import { i18n } from '@repo/i18n/config'
import { setRequestLocale } from '@repo/i18n/server'
import { allProjects } from 'content-collections'
import { notFound } from 'next/navigation'

import BlurImage from '@/components/blur-image'
import Mdx from '@/components/mdx'
import { SITE_NAME } from '@/lib/constants'
import { getBaseUrl } from '@/utils/get-base-url'
import { getLocalizedPath } from '@/utils/get-localized-path'

import Header from './header'

type PageProps = {
  params: Promise<{
    slug: string
    locale: string
  }>
}

export const generateStaticParams = (): Array<{ slug: string; locale: string }> => {
  return allProjects.map((project) => ({
    slug: project.slug,
    locale: project.locale
  }))
}

export const generateMetadata = async (props: PageProps, parent: ResolvingMetadata): Promise<Metadata> => {
  const { params } = props
  const { slug, locale } = await params

  const project = allProjects.find((p) => p.slug === slug && p.locale === locale)

  if (!project) {
    return {}
  }

  const { name, description } = project
  const { openGraph = {}, twitter = {} } = await parent
  const fullSlug = `/projects/${slug}`
  const url = getLocalizedPath({ slug: fullSlug, locale, absolute: false })

  return {
    title: name,
    description: description,
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
      title: name,
      description: description,
      images: [
        {
          url: `/images/projects/${slug}/cover.png`,
          width: 1280,
          height: 832,
          alt: description,
          type: 'image/png'
        }
      ]
    },
    twitter: {
      ...twitter,
      title: name,
      description: description,
      images: [
        {
          url: `/images/projects/${slug}/cover.png`,
          width: 1280,
          height: 832,
          alt: description
        }
      ]
    }
  }
}

const Page = async (props: PageProps) => {
  const { params } = props
  const { slug, locale } = await params
  setRequestLocale(locale)

  const project = allProjects.find((p) => p.slug === slug && p.locale === locale)
  const url = getLocalizedPath({ slug: `/projects/${slug}`, locale, absolute: true })

  if (!project) {
    notFound()
  }

  const { name, code, description, github } = project

  const jsonLd: WithContext<SoftwareApplication> = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    url,
    applicationCategory: 'WebApplication',
    author: {
      '@type': 'Person',
      name: SITE_NAME,
      url: getBaseUrl()
    },
    sameAs: [github],
    screenshot: `${getBaseUrl()}/images/projects/${slug}/cover.png`
  }

  return (
    <>
      {/* eslint-disable-next-line @eslint-react/dom/no-dangerously-set-innerhtml -- safe */}
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className='mx-auto max-w-3xl'>
        <Header {...project} />
        <BlurImage
          src={`/images/projects/${slug}/cover.png`}
          width={1280}
          height={832}
          alt={name}
          className='my-12 rounded-lg'
          lazy={false}
        />
        <Mdx code={code} />
      </div>
    </>
  )
}

export default Page
