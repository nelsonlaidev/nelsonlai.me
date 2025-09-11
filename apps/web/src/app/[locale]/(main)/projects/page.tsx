import type { Metadata } from 'next'
import type { CollectionPage, WithContext } from 'schema-dts'

import { i18n } from '@repo/i18n/config'
import { getTranslations, setRequestLocale } from '@repo/i18n/server'
import { allProjects } from 'content-collections'

import JsonLd from '@/components/json-ld'
import PageTitle from '@/components/page-title'
import ProjectCards from '@/components/project-cards'
import { MY_NAME } from '@/lib/constants'
import { createMetadata } from '@/lib/metadata'
import { getBaseUrl } from '@/utils/get-base-url'
import { getLocalizedPath } from '@/utils/get-localized-path'

export const generateStaticParams = (): Array<{ locale: string }> => {
  return i18n.locales.map((locale) => ({ locale }))
}

export const generateMetadata = async (props: PageProps<'/[locale]/projects'>): Promise<Metadata> => {
  const { params } = props
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'projects' })
  const title = t('title')
  const description = t('description')

  return createMetadata({
    pathname: '/projects',
    title,
    description,
    locale,
    ogImagePathname: '/projects/og-image.png'
  })
}

const Page = async (props: PageProps<'/[locale]/projects'>) => {
  const { params } = props
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations()
  const title = t('projects.title')
  const description = t('projects.description')
  const url = getLocalizedPath({ locale, pathname: '/projects' })

  const projects = allProjects
    .filter((project) => project.locale === locale)
    .toSorted((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime())

  const jsonLd: WithContext<CollectionPage> = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': url,
    name: title,
    description,
    url,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: projects.map((project, index) => ({
        '@type': 'SoftwareSourceCode',
        name: project.name,
        description: project.description,
        url: `${url}/${project.slug}`,
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
      <ProjectCards projects={projects} />
    </>
  )
}

export default Page
