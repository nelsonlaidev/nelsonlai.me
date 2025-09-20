import type { Post } from '.content-collections/generated'

import fs from 'node:fs/promises'
import path from 'node:path'

import { expect, test as setup } from '@playwright/test'
import { db, posts } from '@repo/db'

import { TEST_POSTS } from '../fixtures/posts'
import { makeDummyImage } from '../utils/make-dummy-image'

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

const extractJsonFromArrayFile = (fileContent: string): Post[] => {
  const startIndex = fileContent.indexOf('[')
  const endIndex = fileContent.lastIndexOf(']')
  if (startIndex === -1 || endIndex === -1) {
    throw new Error('Could not find array in file content')
  }
  const jsonString = fileContent.slice(startIndex, endIndex + 1)

  return JSON.parse(jsonString) as Post[]
}

const waitForContentBuild = async () => {
  await expect(async () => {
    const fileContent = await fs.readFile(
      path.join(process.cwd(), '.content-collections/generated/allPosts.js'),
      'utf8'
    )
    const allPosts = extractJsonFromArrayFile(fileContent)

    for (const post of TEST_POSTS) {
      expect(allPosts.find((p) => p.slug === post.slug)).toBeDefined()
    }
  }).toPass({ timeout: 5000 })
}

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
    const testPostCoverPath = path.join(process.cwd(), `public/images/blog/${post.slug}/cover.png`)

    // For CI, we need to build the app, so we'll create the test files in CI workflow.
    if (!process.env.CI) {
      await fs.writeFile(testPostPath, createTestPost(post.title))

      const coverDir = path.dirname(testPostCoverPath)
      await fs.mkdir(coverDir, { recursive: true })
      await makeDummyImage(testPostCoverPath)

      await new Promise((resolve) => setTimeout(resolve, 200)) // Don't generate too fast
    }
  }

  await waitForContentBuild()
})
