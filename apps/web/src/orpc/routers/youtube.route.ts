import { env } from '@repo/env'

import { publicProcedure } from '../root'
import { youtubeStatsSchema } from '../schemas/youtube.schema'

export const youtubeStats = publicProcedure.output(youtubeStatsSchema).handler(async () => {
  if (!env.GOOGLE_API_KEY) {
    return {
      subscribers: 0,
      views: 0
    }
  }

  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?id=UC2hMWOaOlk9vrkvFVaGmn0Q&part=statistics&key=${env.GOOGLE_API_KEY}`
  )
  const data = await response.json()

  const channel = data.items[0]
  const statistics = channel.statistics

  return {
    subscribers: Number(statistics.subscriberCount),
    views: Number(statistics.viewCount)
  }
})
