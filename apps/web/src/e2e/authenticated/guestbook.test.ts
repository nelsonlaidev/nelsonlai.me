import { createId } from '@paralleldrive/cuid2'
import test, { expect } from '@playwright/test'
import { db, guestbook } from '@repo/db'

import { TEST_UNIQUE_ID } from '../fixtures/auth'

test.describe('guestbook page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/guestbook')
  })

  test('should be able to submit a message', async ({ page }) => {
    const message = createId()

    await page.getByTestId('guestbook-textarea').fill(message)

    await page.getByTestId('guestbook-submit-button').click()
    await expect(page.locator('li[data-sonner-toast]')).toContainText('Create message successfully')

    await expect(page.getByTestId('guestbook-messages-list').getByText(message)).toBeVisible()
  })

  test('should be able to delete a message', async ({ page }) => {
    const id = createId()

    await db.insert(guestbook).values({
      id,
      body: 'Test message',
      userId: TEST_UNIQUE_ID
    })

    const messageBlock = page.getByTestId(`message-${id}`)
    await expect(messageBlock).toBeVisible()
    await messageBlock.getByTestId('guestbook-delete-button').click()

    const deleteDialog = page.getByTestId('guestbook-dialog')
    await expect(deleteDialog).toBeVisible()
    await deleteDialog.getByTestId('guestbook-dialog-delete-button').click()

    await expect(messageBlock).toBeHidden()
    await expect(page.locator('li[data-sonner-toast]')).toContainText('Delete message successfully')
  })
})
