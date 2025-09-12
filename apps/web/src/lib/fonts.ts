import type { SatoriOptions } from 'next/dist/compiled/@vercel/og/satori'

import fs from 'node:fs/promises'
import path from 'node:path'

import { cache } from 'react'

const getFontPath = (fontName: string) => path.join(process.cwd(), 'public', 'fonts', fontName)

const getRegularFont = cache(async () => {
  const response = await fs.readFile(getFontPath('Geist-Regular.otf'))
  const font = Uint8Array.from(response).buffer

  return font
})

const getMediumFont = cache(async () => {
  const response = await fs.readFile(getFontPath('Geist-Medium.otf'))
  const font = Uint8Array.from(response).buffer

  return font
})

const getSemiBoldFont = cache(async () => {
  const response = await fs.readFile(getFontPath('Geist-SemiBold.otf'))
  const font = Uint8Array.from(response).buffer

  return font
})

const fetchGoogleFont = cache(async (font: string, text: string): Promise<ArrayBuffer> => {
  const cssURL = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}&text=${encodeURIComponent(text)}`

  const cssResponse = await fetch(cssURL, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1'
    }
  })

  const css = await cssResponse.text()

  const match = /src: url\((.+?)\) format\('(?:opentype|truetype)'\)/.exec(css)

  if (!match?.[1]) {
    throw new Error('Failed to extract font URL from CSS')
  }

  const fontURL = match[1]
  const fontResponse = await fetch(fontURL)
  const fontData = await fontResponse.arrayBuffer()

  return fontData
})

export const getOGImageFonts = async (title: string): Promise<SatoriOptions['fonts']> => {
  const [regularFontData, mediumFontData, semiBoldFontData, notoSansTCData, notoSansSCData] = await Promise.all([
    getRegularFont(),
    getMediumFont(),
    getSemiBoldFont(),
    fetchGoogleFont('Noto Sans TC', title),
    fetchGoogleFont('Noto Sans SC', title)
  ])

  return [
    {
      name: 'Geist Sans',
      data: regularFontData,
      style: 'normal',
      weight: 400
    },
    {
      name: 'Geist Sans',
      data: mediumFontData,
      style: 'normal',
      weight: 500
    },
    {
      name: 'Geist Sans',
      data: semiBoldFontData,
      style: 'normal',
      weight: 600
    },
    {
      name: 'Noto Sans TC',
      data: notoSansTCData,
      style: 'normal',
      weight: 400
    },
    {
      name: 'Noto Sans SC',
      data: notoSansSCData,
      style: 'normal',
      weight: 400
    }
  ]
}
