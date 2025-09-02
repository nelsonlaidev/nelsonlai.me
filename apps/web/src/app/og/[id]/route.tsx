import fs from 'node:fs'
import path from 'node:path'

import { db, eq, posts } from '@repo/db'
import { getErrorMessage } from '@repo/utils'
import { allPosts } from 'content-collections'
import { ImageResponse } from 'next/og'
import { NextResponse } from 'next/server'

import { getBaseUrl } from '@/utils/get-base-url'

export const GET = async (_request: Request, props: RouteContext<'/og/[id]'>) => {
  const { params } = props
  const { id } = await params

  try {
    const postMetadata = allPosts.find((p) => p.slug === id)

    if (!postMetadata) {
      return NextResponse.json(
        {
          error: 'Post not found'
        },
        {
          status: 404
        }
      )
    }

    const { title, date } = postMetadata

    const getTitleFontSize = () => {
      if (title.length > 50) return 36
      if (title.length > 40) return 48
      return 64
    }

    const roboto = fs.readFileSync(path.join(process.cwd(), 'src/app/og/[id]/RobotoCondensed-Bold.ttf'))

    const [post] = await db
      .select({
        views: posts.views,
        likes: posts.likes
      })
      .from(posts)
      .where(eq(posts.slug, id))

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const textColor = 'hsl(0 0% 90%)'

    return new ImageResponse(
      (
        <div
          style={{
            backgroundImage: `url(${getBaseUrl()}/images/og-background.png)`,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            padding: '48px 56px',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontFamily: 'Roboto Condensed',
            fontWeight: 700
          }}
        >
          <div
            style={{
              color: textColor,
              fontSize: 30
            }}
          >
            {date.split('T')[0]}
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div
              style={{
                fontSize: getTitleFontSize(),
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                letterSpacing: '-0.03em',
                color: 'transparent',
                backgroundImage: 'linear-gradient(91.52deg, #FF4D4D 0.79%, #FFCCCC 109.05%)',
                marginBottom: 24
              }}
            >
              {title}
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: 24,
                gap: 16,
                color: textColor
              }}
            >
              <span>{post.likes} likes</span>
              <span>·</span>
              <span>{post.views} views</span>
            </div>
          </div>
          <div
            style={{
              color: textColor,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%'
            }}
          >
            <svg width='33' height='48' viewBox='0 0 33 48' fill='currentColor' xmlns='http://www.w3.org/2000/svg'>
              <path d='M24.585 21.7884L22.44 4.91468C22.44 3.27645 23.21 2.45734 24.75 2.45734C26.29 2.45734 27.17 3.27645 27.39 4.91468C28.655 13.7065 29.3975 19.1399 29.6175 21.215C29.8925 23.2355 30.3325 25.7201 30.9375 28.6689C32.3125 35.3311 33 40.1365 33 43.0853C33 44.7235 32.175 45.5427 30.525 45.5427C28.875 45.5427 28.05 44.7235 28.05 43.0853C28.05 40.5734 27.83 38.3345 27.39 36.3686C27.005 34.3481 26.6475 32.5734 26.3175 31.0444C26.0425 29.5154 25.85 28.5324 25.74 28.0956C23.1 30.116 18.9475 31.1263 13.2825 31.1263C13.7775 35.4403 14.025 38.6075 14.025 40.628C14.025 45.5427 11.825 48 7.425 48C4.73 48 2.805 46.3618 1.65 43.0853C0.55 40.1365 0 36.9693 0 33.5836C0 31.1809 0.88 29.3515 2.64 28.0956C4.455 26.8396 6.1875 26.2116 7.8375 26.2116C6.4625 14.2526 5.775 6.33447 5.775 2.45734C5.775 0.819112 6.6 0 8.25 0C9.9 0 10.725 0.87372 10.725 2.62116C10.725 4.3686 10.835 6.60751 11.055 9.33788C11.275 12.5597 11.715 16.9829 12.375 22.6075L12.87 26.2116C16.39 26.2116 19.2225 25.7747 21.3675 24.901C23.5125 24.0273 24.585 22.9898 24.585 21.7884ZM4.95 34.0751C4.95 35.1672 5.17 36.942 5.61 39.3993C6.105 41.8567 6.71 43.0853 7.425 43.0853C8.195 43.0853 8.6625 42.9215 8.8275 42.5939C8.9925 42.2662 9.075 41.6109 9.075 40.628L8.25 31.1263C7.37 31.1263 6.6 31.3447 5.94 31.7816C5.28 32.2184 4.95 32.9829 4.95 34.0751Z' />
            </svg>
            <div
              style={{
                fontSize: 30
              }}
            >
              nelsonlai.me
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Roboto Condensed',
            data: roboto,
            weight: 700,
            style: 'normal'
          }
        ]
      }
    )
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to generate image: ' + getErrorMessage(error)
      },
      {
        status: 500
      }
    )
  }
}
