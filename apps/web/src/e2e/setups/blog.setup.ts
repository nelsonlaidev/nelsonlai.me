import fs from 'node:fs/promises'
import path from 'node:path'

import { test as setup } from '@playwright/test'
import { db, posts } from '@repo/db'

import { TEST_POSTS } from '../fixtures/posts'

const createTestPost = (title: string) => `\
---
title: ${title}
date: '1970-01-01T00:00:00Z'
modifiedTime: '1970-01-01T00:00:00Z'
summary: This is a test post.
---

# ${title}

This is a test post.
`

setup('setup blog', async () => {
  for (const post of TEST_POSTS) {
    await db
      .insert(posts)
      .values({
        slug: post.slug,
        views: 0,
        likes: 0
      })
      .onConflictDoNothing({ target: posts.slug })
    const testPostPath = path.join(process.cwd(), `src/content/blog/en/${post.slug}.mdx`)
    await fs.writeFile(testPostPath, createTestPost(post.title))
  }
})
