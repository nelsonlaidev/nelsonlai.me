import { createEnv } from '@t3-oss/env-nextjs'
import { vercel } from '@t3-oss/env-nextjs/presets-zod'
import { z } from 'zod'

export const env = createEnv({
  extends: [vercel()],

  shared: {
    NODE_ENV: z.enum(['development', 'test', 'production']).optional()
  },

  server: {
    // Required
    DATABASE_URL: z.string().url(),

    UPSTASH_REDIS_REST_URL: z.string().url(),
    UPSTASH_REDIS_REST_TOKEN: z.string().min(1),

    IP_ADDRESS_SALT: z.string().min(1),

    BETTER_AUTH_SECRET: z.string().min(1),

    // Optional
    SPOTIFY_CLIENT_ID: z.string().min(1).optional(),
    SPOTIFY_CLIENT_SECRET: z.string().min(1).optional(),
    SPOTIFY_REFRESH_TOKEN: z.string().min(1).optional(),

    GOOGLE_API_KEY: z.string().min(1).optional(),
    GITHUB_TOKEN: z.string().min(1).optional(),
    WAKATIME_API_KEY: z.string().min(1).optional(),

    GOOGLE_CLIENT_ID: z.string().min(1).optional(),
    GOOGLE_CLIENT_SECRET: z.string().min(1).optional(),
    GITHUB_CLIENT_ID: z.string().min(1).optional(),
    GITHUB_CLIENT_SECRET: z.string().min(1).optional(),

    DISCORD_WEBHOOK_URL: z.string().url().optional(),

    RESEND_API_KEY: z.string().min(1).optional(),
    AUTHOR_EMAIL: z.string().email().optional()
  },
  client: {
    // Required
    NEXT_PUBLIC_SITE_URL: z.string().url(),
    // Optional
    NEXT_PUBLIC_VERCEL_ENV: z.string().optional(),
    NEXT_PUBLIC_VERCEL_BRANCH_URL: z.string().optional(),

    NEXT_PUBLIC_UMAMI_URL: z.string().url().optional(),
    NEXT_PUBLIC_UMAMI_WEBSITE_ID: z.string().uuid().optional()
  },
  experimental__runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,

    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_VERCEL_ENV: process.env.NEXT_PUBLIC_VERCEL_ENV,
    NEXT_PUBLIC_VERCEL_BRANCH_URL: process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL,

    NEXT_PUBLIC_UMAMI_URL: process.env.NEXT_PUBLIC_UMAMI_URL,
    NEXT_PUBLIC_UMAMI_WEBSITE_ID: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID
  },

  emptyStringAsUndefined: true
})
