import { getErrorMessage } from '@repo/utils'
import { allPosts } from 'content-collections'
import { ImageResponse } from 'next/og'
import { NextResponse } from 'next/server'

import OGImage from '@/components/og-image'
import { getMediumFont, getRegularFont, getSemiBoldFont } from '@/lib/fonts'

export const GET = async (_request: Request, props: RouteContext<'/[locale]/blog/[slug]/og-image.png'>) => {
  const { params } = props
  const { slug } = await params

  try {
    const [regularFontData, mediumFontData, semiBoldFontData] = await Promise.all([
      getRegularFont(),
      getMediumFont(),
      getSemiBoldFont()
    ])
    const post = allPosts.find((p) => p.slug === slug)

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return new ImageResponse(<OGImage title={post.title} url='/blog' />, {
      width: 1200,
      height: 630,
      fonts: [
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
        }
      ]
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
