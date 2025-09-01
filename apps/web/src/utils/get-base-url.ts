import { env } from '@repo/env'

export const getBaseUrl = () => {
  if (env.NEXT_PUBLIC_VERCEL_ENV === 'preview') return `https://${env.NEXT_PUBLIC_VERCEL_BRANCH_URL}`

  return env.NEXT_PUBLIC_SITE_URL
}
