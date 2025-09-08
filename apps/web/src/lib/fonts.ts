import fs from 'node:fs/promises'

import { cache } from 'react'

export const getRegularFont = cache(async () => {
  const response = await fs.readFile('public/fonts/Geist-Regular.otf')
  const font = Uint8Array.from(response).buffer

  return font
})

export const getMediumFont = cache(async () => {
  const response = await fs.readFile('public/fonts/Geist-Medium.otf')
  const font = Uint8Array.from(response).buffer

  return font
})

export const getSemiBoldFont = cache(async () => {
  const response = await fs.readFile('public/fonts/Geist-SemiBold.otf')
  const font = Uint8Array.from(response).buffer

  return font
})
