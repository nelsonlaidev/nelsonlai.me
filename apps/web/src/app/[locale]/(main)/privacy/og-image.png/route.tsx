import { getErrorMessage } from '@repo/utils'
import { allPages } from 'content-collections'
import { ImageResponse } from 'next/og'
import { NextResponse } from 'next/server'
import { getTranslations } from 'next-intl/server'

import OGImage from '@/components/og-image'
import { OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH } from '@/lib/constants'
import { getOGImageFonts } from '@/lib/fonts'

export const GET = async (_request: Request, props: RouteContext<'/[locale]/privacy/og-image.png'>) => {
  const { params } = props
  const { locale } = await params

  const t = await getTranslations({ locale })
  const title = t('privacy.title')

  try {
    const page = allPages.find((p) => p.slug === 'privacy' && p.locale === locale)

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }

    const ogImageFonts = await getOGImageFonts(title)

    return new ImageResponse(<OGImage title={title} url='/privacy' />, {
      width: OG_IMAGE_WIDTH,
      height: OG_IMAGE_HEIGHT,
      fonts: ogImageFonts
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to generate image: ' + getErrorMessage(error)
      },
      { status: 500 }
    )
  }
}
