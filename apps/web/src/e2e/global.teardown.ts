import fs from 'node:fs/promises'
import path from 'node:path'

import { test as teardown } from '@playwright/test'
import { comments, db, eq, guestbook, like, likesSessions, posts, sessions, users } from '@repo/db'
import { redis } from '@repo/kv'

import { TEST_UNIQUE_ID } from './fixtures/auth'
import { TEST_POSTS } from './fixtures/posts'

teardown('teardown global', async () => {
  // Delete test user related data
  await db.delete(comments).where(like(comments.postId, 'test%'))
  await db.delete(guestbook).where(eq(guestbook.userId, TEST_UNIQUE_ID))
  await db.delete(likesSessions).where(like(likesSessions.id, 'test___%'))
  await db.delete(posts).where(like(posts.slug, 'test%'))
  await db.delete(sessions).where(like(sessions.userId, TEST_UNIQUE_ID))
  await db.delete(users).where(eq(users.id, TEST_UNIQUE_ID))

  // Delete test blog posts
  for (const post of TEST_POSTS) {
    await fs.rm(path.join(process.cwd(), 'src/content/blog/en', `${post.slug}.mdx`))
    await fs.rmdir(path.join(process.cwd(), 'public/images/blog', post.slug), { recursive: true })
  }

  // Clean cache
  await redis.flushall()
})
