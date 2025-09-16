/*
 * avatar (MIT License)
 * Copyright (c) Vercel
 * Source: https://github.com/vercel/avatar/blob/410bc1e438ef26a7456b037bbdd44d5aec49031a/pages/api/avatar/%5Bname%5D.tsx
 *
 * Modified by: Nelson Lai
 */
import { getErrorMessage } from '@repo/utils'
import { ImageResponse } from 'next/og'
import { NextResponse } from 'next/server'
import color from 'tinycolor2'

export const runtime = 'edge'

const djb2 = (str: string) => {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.codePointAt(i)!
  }
  return hash
}

const generateGradient = (id: string) => {
  const c1 = color({ h: djb2(id) % 360, s: 0.95, l: 0.5 })
  const second = c1.triad()[1].toHexString()

  return {
    fromColor: c1.toHexString(),
    toColor: second
  }
}

export const GET = async (request: Request, context: RouteContext<'/api/avatar/[id]'>) => {
  const { params } = context
  const { id } = await params

  const { searchParams } = new URL(request.url)
  const size = searchParams.get('size') ?? '40'

  try {
    const gradient = generateGradient(id)

    return new ImageResponse(
      (
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          version='1.1'
          xmlns='http://www.w3.org/2000/svg'
        >
          <g>
            <defs>
              <linearGradient id='gradient' x1='0' y1='0' x2='1' y2='1'>
                <stop offset='0%' stopColor={gradient.fromColor} />
                <stop offset='100%' stopColor={gradient.toColor} />
              </linearGradient>
            </defs>
            <rect fill='url(#gradient)' x='0' y='0' width={size} height={size} />
          </g>
        </svg>
      ),
      {
        width: Number(size),
        height: Number(size)
      }
    )
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to generate avatar: ' + getErrorMessage(error)
      },
      {
        status: 500
      }
    )
  }
}
