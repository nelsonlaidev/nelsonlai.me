import { Buffer } from 'node:buffer'

import { env } from '@repo/env'

import { publicProcedure } from '../root'
import { wakatimeStatsSchema } from '../schemas/wakatime.schema'

export const wakatimeStats = publicProcedure.output(wakatimeStatsSchema).handler(async () => {
  if (!env.WAKATIME_API_KEY) {
    return {
      hours: 0
    }
  }

  const response = await fetch('https://wakatime.com/api/v1/users/current/all_time_since_today', {
    headers: {
      Authorization: `Basic ${Buffer.from(env.WAKATIME_API_KEY).toString('base64')}`
    }
  })

  const {
    data: { total_seconds }
  } = await response.json()

  return {
    hours: Math.round(total_seconds / 60 / 60)
  }
})
