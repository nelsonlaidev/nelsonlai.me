import { comments, users } from '@repo/db'
import { createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

export const listAllCommentsSchema = z.object({
  comments: z.array(createSelectSchema(comments))
})

export const listAllUsersSchema = z.object({
  users: z.array(
    createSelectSchema(users).pick({
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true
    })
  )
})
