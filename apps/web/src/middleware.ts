import type { NextRequest } from 'next/server'

import { i18nMiddleware } from '@repo/i18n/middleware'

const middleware = (request: NextRequest) => {
  const csp = `
    default-src 'none';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' *.nelsonlai.dev vercel.live va.vercel-scripts.com;
    style-src 'self' 'unsafe-inline' vercel.live;
    img-src 'self' data: avatars.githubusercontent.com *.googleusercontent.com;
    font-src 'self';
    object-src 'none';
    base-uri 'none';
    form-action 'none';
    connect-src 'self';
    media-src 'self';
    manifest-src 'self';
    frame-ancestors 'none';
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
   * - favicon.ico (favicon file)
   * - folders in public (which resolve to /foldername)
   * - sitemap.xml
   * - robots.txt
   * - rss.xml
   */
  matcher: [
    '/((?!api|rpc|_next/static|_next/image|_vercel|og|favicon|fonts|images|videos|favicon.ico|sitemap.xml|robots.txt|rss.xml).*)'
  ]
}

export default middleware
