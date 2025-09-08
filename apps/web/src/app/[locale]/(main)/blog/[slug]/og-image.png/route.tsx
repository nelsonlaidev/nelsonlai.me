import { getErrorMessage } from '@repo/utils'
import { allPosts } from 'content-collections'
import { ImageResponse } from 'next/og'
import { NextResponse } from 'next/server'

import OGImage from '@/components/og-image'
import { getOGImageFonts } from '@/lib/fonts'

export const GET = async (_request: Request, props: RouteContext<'/[locale]/blog/[slug]/og-image.png'>) => {
  const { params } = props
  const { slug, locale } = await params

  try {
    const ogImageFonts = await getOGImageFonts()
    const post = allPosts.find((p) => p.slug === slug && p.locale === locale)

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return new ImageResponse(<OGImage title={post.title} url='/blog' />, {
      width: 1200,
      height: 630,
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
