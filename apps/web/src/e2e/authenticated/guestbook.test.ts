import { createId } from '@paralleldrive/cuid2'
import { expect, test } from '@playwright/test'
import { db, eq, guestbook } from '@repo/db'

import { getTestUser } from '../utils/get-test-user'

test.describe('guestbook page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/guestbook')
  })

  test('should be able to submit a message', async ({ page }) => {
    const message = createId()

    await page.getByTestId('guestbook-textarea').fill(message)
    await page.getByTestId('guestbook-submit-button').click()

    // Check toast immediately after submission
    await expect(page.locator('li[data-sonner-toast]')).toContainText(
      'Create message successfully',
      { timeout: 5000 }
    )

    // Then verify the message appears in the list
    await expect(page.getByTestId('guestbook-messages-list').getByText(message)).toBeVisible({
      timeout: 10_000
    })

    // Remove the message
    await db.delete(guestbook).where(eq(guestbook.body, message))
  })

  test('should be able to delete a message', async ({ page }) => {
    const id = createId()
    const user = await getTestUser()

    await db.insert(guestbook).values({
      id,
      body: 'Test message',
      userId: user.id
    })

    await page.reload()

    const messageBlock = page.getByTestId(`message-${id}`)
    await expect(messageBlock).toBeVisible({ timeout: 5000 })
    await messageBlock.getByTestId('guestbook-delete-button').click()

    const deleteDialog = page.getByTestId('guestbook-dialog')
    await expect(deleteDialog).toBeVisible({ timeout: 5000 })
    await deleteDialog.getByTestId('guestbook-dialog-delete-button').click()

    await expect(messageBlock).toBeHidden({ timeout: 10_000 })
    await expect(page.locator('li[data-sonner-toast]')).toContainText(
      'Delete message successfully',
      { timeout: 5000 }
    )

    // Remove the message
    await db.delete(guestbook).where(eq(guestbook.id, id))
  })
})
