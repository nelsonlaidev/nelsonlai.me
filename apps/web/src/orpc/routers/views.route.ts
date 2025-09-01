import { ORPCError } from '@orpc/client'
import { eq, posts, sql } from '@repo/db'

import { cache } from '../cache'
import { publicProcedure } from '../root'
import { getViewInputSchema, incrementViewInputSchema, viewSchema } from '../schemas/views.schema'

export const countView = publicProcedure
  .input(getViewInputSchema)
  .output(viewSchema)
  .handler(async ({ input, context }) => {
    const cached = await cache.posts.views.get(input.slug)

    if (cached) {
      return cached
    }

    const [post] = await context.db.select({ views: posts.views }).from(posts).where(eq(posts.slug, input.slug))

    if (!post) {
      throw new ORPCError('NOT_FOUND', {
        message: 'Post not found'
      })
    }

    const viewsData = { views: post.views }

    await cache.posts.views.set(viewsData, input.slug)

    return viewsData
  })

export const incrementView = publicProcedure
  .input(incrementViewInputSchema)
  .output(viewSchema)
  .handler(async ({ input, context }) => {
    const [result] = await context.db
      .insert(posts)
      .values({
        slug: input.slug,
        views: 1
      })
      .onConflictDoUpdate({
        target: posts.slug,
        set: {
          views: sql`${posts.views} + 1`
        }
      })
      .returning()

    if (!result) {
      throw new ORPCError('INTERNAL_SERVER_ERROR', {
        message: 'Failed to increment view'
      })
    }

    const viewsData = { views: result.views }
    await cache.posts.views.set(viewsData, input.slug)

    return viewsData
  })
