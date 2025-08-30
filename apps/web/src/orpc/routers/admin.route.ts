import type { COMMENT_TYPES } from '@/lib/constants'

import {
  and,
  asc,
  comments,
  count,
  desc,
  gt,
  gte,
  ilike,
  inArray,
  isNotNull,
  isNull,
  lte,
  or,
  type SQLWrapper,
  users
} from '@repo/db'

import { adminProcedure } from '@/orpc/root'

import {
  listAllCommentsInputSchema,
  listAllCommentsSchema,
  listAllUsersInputSchema,
  listAllUsersSchema
} from '../schemas/admin.schema'

const getParentIdFilter = (parentId: Array<(typeof COMMENT_TYPES)[number]>) => {
  const conditions: SQLWrapper[] = []
  if (parentId.includes('comment')) conditions.push(isNull(comments.parentId))
  if (parentId.includes('reply')) conditions.push(isNotNull(comments.parentId))
  return conditions.length > 0 ? or(...conditions) : void 0
}

const getCommentsCreatedDateFilter = (from?: Date, to?: Date) => {
  const conditions: SQLWrapper[] = []
  if (from) conditions.push(gte(comments.createdAt, from))
  if (to) conditions.push(lte(comments.createdAt, to))
  return conditions.length > 0 ? and(...conditions) : void 0
}

const getUsersCreatedDateFilter = (from?: Date, to?: Date) => {
  const conditions: SQLWrapper[] = []
  if (from) conditions.push(gte(users.createdAt, from))
  if (to) conditions.push(lte(users.createdAt, to))
  return conditions.length > 0 ? and(...conditions) : void 0
}

export const listAllComments = adminProcedure
  .input(listAllCommentsInputSchema)
  .output(listAllCommentsSchema)
  .handler(async ({ input, context }) => {
    const offset = (input.page - 1) * input.perPage

    const createdFrom = input.createdAt[0]
    const createdTo = input.createdAt[1]

    if (createdFrom) createdFrom.setHours(0, 0, 0, 0)
    if (createdTo) createdTo.setHours(23, 59, 59, 999)

    const orderBy =
      input.sort.length > 0
        ? input.sort.map((item) => (item.desc ? desc(comments[item.id]) : asc(comments[item.id])))
        : [asc(comments.createdAt)]

    const query = await context.db.transaction(async (tx) => {
      const data = await tx
        .select()
        .from(comments)
        .limit(input.perPage)
        .where(
          and(
            input.body ? ilike(comments.body, `%${input.body}%`) : undefined,
            input.parentId.length > 0 ? getParentIdFilter(input.parentId) : undefined,
            input.createdAt.length > 0 ? getCommentsCreatedDateFilter(createdFrom, createdTo) : undefined
          )
        )
        .offset(offset)
        .orderBy(...orderBy)

      const total = await tx
        .select({
          count: count()
        })
        .from(comments)
        .execute()
        .then((res) => res[0]?.count ?? 0)

      const typeCounts = await tx
        .select({
          parentId: comments.parentId,
          count: count()
        })
        .from(comments)
        .groupBy(comments.parentId)
        .then((res) => {
          const result = {
            comment: 0,
            reply: 0
          }
          for (const { parentId, count: typeCount } of res) {
            if (parentId) {
              result.reply += typeCount
            } else {
              result.comment = typeCount
            }
          }
          return result
        })

      return { data, total, typeCounts }
    })

    return {
      comments: query.data,
      pageCount: Math.ceil(query.total / input.perPage),
      typeCounts: query.typeCounts
    }
  })

export const listAllUsers = adminProcedure
  .input(listAllUsersInputSchema)
  .output(listAllUsersSchema)
  .handler(async ({ input, context }) => {
    const offset = (input.page - 1) * input.perPage

    const createdFrom = input.createdAt[0]
    const createdTo = input.createdAt[1]

    if (createdFrom) createdFrom.setHours(0, 0, 0, 0)
    if (createdTo) createdTo.setHours(23, 59, 59, 999)

    const orderBy =
      input.sort.length > 0
        ? input.sort.map((item) => (item.desc ? desc(users[item.id]) : asc(users[item.id])))
        : [asc(users.createdAt)]

    const query = await context.db.transaction(async (tx) => {
      const data = await tx
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          role: users.role,
          createdAt: users.createdAt
        })
        .from(users)
        .limit(input.perPage)
        .where(
          and(
            input.name ? ilike(users.name, `%${input.name}%`) : undefined,
            input.role.length > 0 ? inArray(users.role, input.role) : undefined,
            input.createdAt.length > 0 ? getUsersCreatedDateFilter(createdFrom, createdTo) : undefined
          )
        )
        .offset(offset)
        .orderBy(...orderBy)

      const total = await tx
        .select({
          count: count()
        })
        .from(users)
        .execute()
        .then((res) => res[0]?.count ?? 0)

      const roleCounts = await tx
        .select({
          role: users.role,
          count: count()
        })
        .from(users)
        .groupBy(users.role)
        .having(gt(count(users.role), 0))
        .then((res) => {
          const result = {
            user: 0,
            admin: 0
          }
          for (const { role, count: roleCount } of res) {
            result[role] = roleCount
          }
          return result
        })

      return { data, total, roleCounts }
    })

    return {
      users: query.data,
      pageCount: Math.ceil(query.total / input.perPage),
      roleCounts: query.roleCounts
    }
  })
