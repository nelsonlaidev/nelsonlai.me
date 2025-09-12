import type { MetadataRoute } from 'next'

import { supportedLanguages } from '@repo/i18n/config'
import { allPages, allPosts, allProjects } from 'content-collections'

import { getLocalizedPath } from '@/utils/get-localized-path'

const sitemap = (): MetadataRoute.Sitemap => {
  const pathnames = [
    '',
    '/blog',
    '/guestbook',
    '/projects',
    '/dashboard',
    ...new Set(allPages.map((page) => `/${page.slug}`)),
    ...new Set(allProjects.map((project) => `/projects/${project.slug}`)),
    ...new Set(allPosts.map((post) => `/blog/${post.slug}`))
  ]

  return supportedLanguages.flatMap((locale) => {
    return pathnames.map((pathname) => ({
      url: getLocalizedPath({ locale: locale.code, pathname }),
      lastModified: new Date()
    }))
  })
}

export default sitemap
