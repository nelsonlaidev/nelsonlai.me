import type { Metadata } from 'next'

import { i18n } from '@repo/i18n/config'
import { getTranslations, setRequestLocale } from '@repo/i18n/server'
import { allPages } from 'content-collections'
import { notFound } from 'next/navigation'

import Mdx from '@/components/mdx'
import PageTitle from '@/components/page-title'
import { createMetadata } from '@/lib/metadata'

export const generateStaticParams = (): Array<Awaited<PageProps<'/[locale]/privacy'>['params']>> => {
  return i18n.locales.map((locale) => ({ locale }))
}

export const generateMetadata = async (props: PageProps<'/[locale]/privacy'>): Promise<Metadata> => {
  const { params } = props
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'privacy' })
  const title = t('title')
  const description = t('description')

  return createMetadata({
    pathname: '/privacy',
    title,
    description,
    locale,
    ogImagePathname: '/privacy/og-image.png'
  })
}

const Page = async (props: PageProps<'/[locale]/privacy'>) => {
  const { params } = props
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations()
  const title = t('privacy.title')
  const description = t('privacy.description')
  const page = allPages.find((p) => p.slug === 'privacy' && p.locale === locale)

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
