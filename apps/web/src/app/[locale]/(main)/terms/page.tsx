import type { Metadata } from 'next'

import { i18n } from '@repo/i18n/config'
import { getTranslations, setRequestLocale } from '@repo/i18n/server'
import { allPages } from 'content-collections'
import { notFound } from 'next/navigation'

import Mdx from '@/components/mdx'
import PageTitle from '@/components/page-title'
import { createMetadata } from '@/lib/metadata'

export const generateStaticParams = (): Array<Awaited<PageProps<'/[locale]/terms'>['params']>> => {
  return i18n.locales.map((locale) => ({ locale }))
}

export const generateMetadata = async (props: PageProps<'/[locale]/terms'>): Promise<Metadata> => {
  const { params } = props
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'terms' })
  const title = t('title')
  const description = t('description')

  return createMetadata({
    pathname: '/terms',
    title,
    description,
    locale,
    ogImagePathname: '/terms/og-image.png'
  })
}

const Page = async (props: PageProps<'/[locale]/terms'>) => {
  const { params } = props
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations()
  const title = t('terms.title')
  const description = t('terms.description')
  const page = allPages.find((p) => p.slug === 'terms' && p.locale === locale)

  if (!page) {
    return notFound()
  }

  const { code } = page

  return (
    <>
      <PageTitle title={title} description={description} />
      <Mdx code={code} />
    </>
  )
}

export default Page
