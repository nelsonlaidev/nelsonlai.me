import type { Context } from './context'

import { ORPCError } from '@orpc/client'
import { os } from '@orpc/server'
import { ratelimit } from '@repo/kv'

import { getIp } from '@/utils/get-ip'

const base = os.$context<Context>()

const rateLimitMiddleware = base.middleware(async ({ path, context, next }) => {
  const ip = getIp(context.headers)

  const identifier = `${path.join(':')}:${ip}`
  const { success } = await ratelimit.limit(identifier)

  if (!success) throw new ORPCError('TOO_MANY_REQUESTS')

  return next({ context })
})

const authMiddleware = base.middleware(async ({ context, next }) => {
  if (!context.session?.user) {
    throw new ORPCError('UNAUTHORIZED')
  }

  return next({
    context: {
      session: context.session
    }
  })
})

export const publicProcedure = base.use(rateLimitMiddleware)
export const protectedProcedure = publicProcedure.use(authMiddleware)
export const adminProcedure = protectedProcedure.use(authMiddleware).use(async ({ context, next }) => {
  if (context.session.user.role !== 'admin') {
    throw new ORPCError('FORBIDDEN')
  }

  return next({ context })
})
