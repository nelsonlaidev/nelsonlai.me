import { likesSessions, posts, sum } from '@repo/db'

import { publicProcedure } from '../root'
import { likesStatsSchema, viewsStatsSchema } from '../schemas/blog.schema'

export const viewsStats = publicProcedure.output(viewsStatsSchema).handler(async ({ context }) => {
  const [result] = await context.db
    .select({
      value: sum(posts.views)
    })
    .from(posts)

  const views = result?.value ? Number(result.value) : 0

  return {
    views
  }
})

export const likesStats = publicProcedure.output(likesStatsSchema).handler(async ({ context }) => {
  const [result] = await context.db
    .select({
      value: sum(likesSessions.likes)
    })
    .from(posts)

  const likes = result?.value ? Number(result.value) : 0

  return {
    likes
  }
})
