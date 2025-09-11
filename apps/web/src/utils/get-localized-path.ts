import { i18n } from '@repo/i18n/config'

import { getBaseUrl } from './get-base-url'

type LocalizedDocument = {
  locale: string
  pathname?: string
}

export const getLocalizedPath = (doc: LocalizedDocument) => {
  const { locale, pathname = '' } = doc
  const baseUrl = getBaseUrl()

  const localePath = locale === i18n.defaultLocale ? baseUrl : `${baseUrl}/${locale}`

  return `${localePath}${pathname}`
}
