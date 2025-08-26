import { db, eq, users } from '@repo/db'

import { TEST_USER_EMAILS } from '../data/test-user-emails'

export const getTestUser = async () => {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, TEST_USER_EMAILS[0].email))
    .limit(1)

  if (!user) {
    throw new Error('User not found')
  }

  return user
}
