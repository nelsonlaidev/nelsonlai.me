import type { NextRequest } from 'next/server'

import { env } from '@repo/env'
import { i18nMiddleware } from '@repo/i18n/middleware'

const IS_PREVIEW = env.VERCEL_ENV === 'preview'

const middleware = (request: NextRequest) => {
  const csp = `
    default-src 'none';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.nelsonlai.dev https://va.vercel-scripts.com ${IS_PREVIEW ? 'https://vercel.live' : ''};
    style-src 'self' 'unsafe-inline' ${IS_PREVIEW ? 'https://vercel.live' : ''};
    img-src 'self' data: https://avatars.githubusercontent.com https://*.googleusercontent.com ${IS_PREVIEW ? 'https://vercel.live https://vercel.com blob:' : ''};
    font-src 'self' ${IS_PREVIEW ? 'https://vercel.live https://assets.vercel.com' : ''};
    object-src 'none';
    base-uri 'none';
    form-action 'none';
    connect-src 'self' https://*.nelsonlai.dev ${IS_PREVIEW ? 'https://vercel.live wss://ws-us3.pusher.com' : ''};
    media-src 'self';
    manifest-src 'self';
    frame-ancestors 'none';
    ${IS_PREVIEW ? 'frame-src https://vercel.live;' : ''}
  `

  const response = i18nMiddleware(request)

  response.headers.set('Content-Security-Policy', csp.replaceAll('\n', ''))

  return response
}

export const config = {
  /*
   * Match all request paths except for the ones starting with:
   * - api (API routes)
   * - rpc (oRPC routes)
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - _vercel (Vercel internal)
   * - folders in public (which resolve to /foldername)
   * - favicon.ico (favicon file)
   * - sitemap.xml
   * - robots.txt
   * - rss.xml
   * - site.webmanifest
   */
  matcher: [
    '/((?!api|rpc|_next/static|_next/image|_vercel|favicon|android-chrome|apple-touch-icon|fonts|images|videos|favicon.ico|sitemap.xml|robots.txt|rss.xml|site.webmanifest).*)'
  ]
}

export default middleware
