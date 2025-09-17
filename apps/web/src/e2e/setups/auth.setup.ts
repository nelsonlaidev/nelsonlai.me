import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'

import { test as setup } from '@playwright/test'
import { accounts, db, sessions, users } from '@repo/db'
import { env } from '@repo/env'
import dayjs from 'dayjs'

import { TEST_UNIQUE_ID, TEST_USER } from '../fixtures/auth'

const authStoragePath = path.join(import.meta.dirname, '../.auth/user.json')

setup('setup auth', async () => {
  const expiresAt = dayjs().add(7, 'day').toDate()
  const now = new Date()

  await db.transaction(async (tx) => {
    await tx
      .insert(users)
      .values({
        id: TEST_UNIQUE_ID,
        name: TEST_USER.name,
        email: TEST_USER.email,
        emailVerified: false,
        image: TEST_USER.image,
        createdAt: now,
        updatedAt: now
      })
      .onConflictDoNothing({ target: users.id })

    await tx
      .insert(accounts)
      .values({
        id: TEST_UNIQUE_ID,
        accountId: TEST_USER.accountId,
        providerId: 'github',
        userId: TEST_UNIQUE_ID,
        accessToken: 'gho_000',
        scope: 'read:user,user:email',
        createdAt: now,
        updatedAt: now
      })
      .onConflictDoNothing({ target: accounts.id })

    await tx
      .insert(sessions)
      .values({
        id: TEST_UNIQUE_ID,
        token: TEST_USER.sessionToken,
        userId: TEST_UNIQUE_ID,
        expiresAt,
        createdAt: now,
        updatedAt: now
      })
      .onConflictDoUpdate({
        target: sessions.token,
        set: { expiresAt }
      })
  })

  const signature = crypto.createHmac('sha256', env.BETTER_AUTH_SECRET).update(TEST_USER.sessionToken).digest('base64')
  const signedValue = `${TEST_USER.sessionToken}.${signature}`

  const cookieValue = encodeURIComponent(signedValue)
  const cookieObject = {
    name: 'better-auth.session_token',
    value: cookieValue,
    domain: 'localhost',
    path: '/',
    httpOnly: true,
    secure: false,
    sameSite: 'Lax',
    expires: Math.floor(expiresAt.getTime() / 1000)
  }

  const authDir = path.dirname(authStoragePath)
  await fs.mkdir(authDir, { recursive: true })
  await fs.writeFile(authStoragePath, JSON.stringify({ cookies: [cookieObject], origins: [] }, null, 2))
})
