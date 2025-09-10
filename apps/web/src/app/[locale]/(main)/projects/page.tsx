import type { Metadata, ResolvingMetadata } from 'next'
import type { CollectionPage, WithContext } from 'schema-dts'

import { i18n } from '@repo/i18n/config'
import { getTranslations, setRequestLocale } from '@repo/i18n/server'
import { allProjects } from 'content-collections'

import PageTitle from '@/components/page-title'
import ProjectCards from '@/components/project-cards'
import { MY_NAME } from '@/lib/constants'
import { getBaseUrl } from '@/utils/get-base-url'
import { getLocalizedPath } from '@/utils/get-localized-path'

export const generateStaticParams = (): Array<{ locale: string }> => {
  return i18n.locales.map((locale) => ({ locale }))
}

export const generateMetadata = async (
  props: PageProps<'/[locale]/projects'>,
  parent: ResolvingMetadata
): Promise<Metadata> => {
  const { params } = props
  const { locale } = await params
  const { openGraph = {}, twitter = {} } = await parent
  const t = await getTranslations({ locale, namespace: 'projects' })
  const title = t('title')
  const description = t('description')
  const slug = '/projects'
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

const Page = async (props: PageProps<'/[locale]/projects'>) => {
  const { params } = props
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations()
  const title = t('projects.title')
  const description = t('projects.description')
  const url = getLocalizedPath({ slug: '/projects', locale, absolute: true })

  const projects = allProjects.filter((project) => project.locale === locale)

  const jsonLd: WithContext<CollectionPage> = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': url,
    name: title,
    description,
    url,
    isPartOf: {
      '@type': 'WebSite',
      name: MY_NAME,
      url: getBaseUrl()
    },
    hasPart: allProjects.map((project) => ({
      '@type': 'SoftwareApplication',
      name: project.name,
      description: project.description,
      url: `${url}/${project.slug}`,
      applicationCategory: 'WebApplication'
    }))
  }

  return (
    <>
      {/* eslint-disable-next-line @eslint-react/dom/no-dangerously-set-innerhtml -- Safe */}
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageTitle title={title} description={description} />
      <ProjectCards projects={projects} />
    </>
  )
}

export default Page
