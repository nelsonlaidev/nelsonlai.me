import { ORPCError } from '@orpc/client'
import { createId } from '@paralleldrive/cuid2'
import { and, desc, eq, guestbook, lt } from '@repo/db'
import { env } from '@repo/env'

import { IS_PRODUCTION } from '@/lib/constants'
import { getDefaultImage } from '@/utils/get-default-image'

import { protectedProcedure, publicProcedure } from '../root'
import { emptyOutputSchema } from '../schemas/common.schema'
import {
  createMessageInputSchema,
  deleteMessageInputSchema,
  guestbookInputSchema,
  guestbookSchema,
  messageSchema
} from '../schemas/guestbook.schema'

export const listMessages = publicProcedure
  .input(guestbookInputSchema)
  .output(guestbookSchema)
  .handler(async ({ input, context }) => {
    const query = await context.db.query.guestbook.findMany({
      where: and(input.cursor ? lt(guestbook.createdAt, input.cursor) : undefined),
      limit: input.limit,
      with: {
        user: {
          columns: {
            name: true,
            image: true,
            id: true
          }
        }
      },
      orderBy: desc(guestbook.updatedAt)
    })

    const result = query.map((message) => {
      const defaultImage = getDefaultImage(message.user.id)

      return {
        ...message,
        user: {
          ...message.user,
          name: message.user.name,
          image: message.user.image ?? defaultImage
        }
      }
    })

    return {
      messages: result,
      nextCursor: result.at(-1)?.updatedAt
    }
  })

export const createMessage = protectedProcedure
  .input(createMessageInputSchema)
  .output(messageSchema)
  .handler(async ({ input, context }) => {
    const user = context.session.user

    const [message] = await context.db
      .insert(guestbook)
      .values({
        id: createId(),
        body: input.message,
        userId: user.id
      })
      .returning()

    if (!message) {
      throw new ORPCError('INTERNAL_SERVER_ERROR', {
        message: 'Failed to create message'
      })
    }

    if (IS_PRODUCTION && env.DISCORD_WEBHOOK_URL) {
      await fetch(env.DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: null,
          embeds: [
            {
              title: 'New comment!',
              description: input.message,
              url: 'https://nelsonlai.dev/guestbook',
              color: '6609519',
              author: {
                name: user.name,
                icon_url: user.image
              },
              timestamp: new Date().toISOString()
            }
          ],
          username: 'Blog',
          avatar_url: 'https://cdn.discordapp.com/avatars/1123845082672537751/8af603a10f1d2f86ebc922ede339cd3a.webp',
          attachments: []
        })
      })
    }

    return message
  })

export const deleteMessage = protectedProcedure
  .input(deleteMessageInputSchema)
  .output(emptyOutputSchema)
  .handler(async ({ input, context }) => {
    const user = context.session.user

    const message = await context.db.query.guestbook.findFirst({
      where: and(eq(guestbook.id, input.id), eq(guestbook.userId, user.id))
    })

    if (!message) {
      throw new ORPCError('NOT_FOUND', {
        message: 'Message not found'
      })
    }

    await context.db.delete(guestbook).where(eq(guestbook.id, input.id))
  })
