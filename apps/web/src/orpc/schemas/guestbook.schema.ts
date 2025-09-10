import { guestbook, users } from '@repo/db'
import { createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

import { infiniteQuerySchema } from './common.schema'

export const messageSchema = createSelectSchema(guestbook).pick({
  id: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
  body: true
})

export const createMessageInputSchema = z.object({
  message: z.string().min(1, {
    message: 'Message is required'
  })
})

// eslint-disable-next-line unicorn/prefer-export-from -- This is a schema
export const guestbookInputSchema = infiniteQuerySchema

export const guestbookSchema = z.object({
  messages: z.array(
    messageSchema.extend({
      user: createSelectSchema(users).pick({
        name: true,
        image: true,
        id: true
      })
    })
  ),
  nextCursor: z.date().optional()
})

export const deleteMessageInputSchema = z.object({
  id: z.string()
})
