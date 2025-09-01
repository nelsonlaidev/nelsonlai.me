import { env } from '@repo/env'
import Script from 'next/script'

import { IS_PRODUCTION } from '@/lib/constants'

const Analytics = () => {
  if (!IS_PRODUCTION || !env.NEXT_PUBLIC_UMAMI_URL || !env.NEXT_PUBLIC_UMAMI_WEBSITE_ID) return null

  return (
    <Script async data-website-id={env.NEXT_PUBLIC_UMAMI_WEBSITE_ID} src={`${env.NEXT_PUBLIC_UMAMI_URL}/script.js`} />
  )
}

export default Analytics
