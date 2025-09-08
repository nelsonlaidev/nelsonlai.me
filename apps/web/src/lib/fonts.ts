import { cache } from 'react'

import { getBaseUrl } from '@/utils/get-base-url'

export const getRegularFont = cache(async () => {
  const response = await fetch(`${getBaseUrl()}/fonts/Geist-Regular.otf`)
  const font = await response.arrayBuffer()

  return font
})

export const getMediumFont = cache(async () => {
  const response = await fetch(`${getBaseUrl()}/fonts/Geist-Medium.otf`)
  const font = await response.arrayBuffer()

  return font
})

export const getSemiBoldFont = cache(async () => {
  const response = await fetch(`${getBaseUrl()}/fonts/Geist-SemiBold.otf`)
  const font = await response.arrayBuffer()

  return font
})
