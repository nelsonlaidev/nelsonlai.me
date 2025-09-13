import fs from 'node:fs/promises'
import path from 'node:path'

import { getErrorMessage } from '@repo/utils'
import { NextResponse } from 'next/server'

const getProjectCover = (projectName: string) => {
  return path.join(process.cwd(), 'public', 'images', 'projects', projectName, 'cover.png')
}

export const GET = async (_request: Request, props: RouteContext<'/[locale]/projects/[slug]/og-image.png'>) => {
  const { params } = props
  const { slug } = await params

  try {
    const imageBuffer = await fs.readFile(getProjectCover(slug))

    return new NextResponse(new Uint8Array(imageBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'no-cache, no-store'
      }
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to get image: ' + getErrorMessage(error)
      },
      { status: 500 }
    )
  }
}
