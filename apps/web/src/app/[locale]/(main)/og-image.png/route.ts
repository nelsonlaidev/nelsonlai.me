import fs from 'node:fs/promises'
import path from 'node:path'

import { getErrorMessage } from '@repo/utils'
import { NextResponse } from 'next/server'

export const GET = async () => {
  try {
    const imageBuffer = await fs.readFile(path.join(process.cwd(), 'public', 'images', 'banner.png'))

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
