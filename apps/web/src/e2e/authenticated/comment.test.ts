import { createId } from '@paralleldrive/cuid2'
import { expect, test } from '@playwright/test'
import { comments, db } from '@repo/db'

import { getTestUser } from '../utils/get-test-user'
import { getNumberFlow } from '../utils/number-flow'

test.describe('comment page', () => {
  test('should be able to submit a comment', async ({ page }) => {
    const commentText = `comment-${createId()}`

    await page.goto('/blog/test-submit')

    await page.getByTestId('comment-textarea-post').fill(commentText)
    await page.getByTestId('comment-submit-button').click()

    await expect(page.getByTestId('comments-list').getByText(commentText)).toBeVisible()
    await expect(page.locator('li[data-sonner-toast]')).toContainText('Comment posted')

    // Comment count should be updated in the blog header and comment header
    expect(await getNumberFlow(page.getByTestId('comment-count'))).toBe('1')
    expect(await getNumberFlow(page.getByTestId('blog-comment-count'))).toBe('1 comment')
  })

  test('should be able to delete a comment', async ({ page }) => {
    const commentId = createId()
    const user = await getTestUser()

    await db.insert(comments).values({
      id: commentId,
      body: 'Test Comment',
      postId: 'test-delete',
      userId: user.id
    })

    await page.goto('/blog/test-delete')

    const commentBlock = page.getByTestId(`comment-${commentId}`)
    await expect(commentBlock).toBeVisible()
    await commentBlock.getByTestId('comment-menu-button').click()

    await page.getByTestId('comment-delete-button').click()

    const deleteDialog = page.getByTestId('comment-dialog')
    await expect(deleteDialog).toBeVisible()
    await deleteDialog.getByTestId('comment-dialog-delete-button').click()

    await expect(commentBlock).toBeHidden()
    await expect(page.locator('li[data-sonner-toast]')).toContainText('Deleted a comment')

    // Comment count should be updated in the blog header and comment header
    expect(await getNumberFlow(page.getByTestId('comment-count'))).toBe('0')
    expect(await getNumberFlow(page.getByTestId('blog-comment-count'))).toBe('0 comments')
  })

  test('should be able to reply to a comment', async ({ page }) => {
    const parentId = createId()
    const replyText = `reply-${createId()}`
    const user = await getTestUser()

    await db.insert(comments).values({
      id: parentId,
      body: 'Parent Comment',
      postId: 'test-reply',
      userId: user.id
    })

    await page.goto('/blog/test-reply')

    const parentCommentBlock = page.getByTestId(`comment-${parentId}`)

    await parentCommentBlock.getByTestId('comment-reply-button').click()

    await page.getByTestId('comment-textarea-reply').fill(replyText)
    await page.getByTestId('comment-submit-reply-button').click()

    const expandButton = parentCommentBlock.getByTestId('comment-replies-expand-button')
    await expect(expandButton.getByTestId('comment-reply-count')).toContainText('1')
    await expandButton.click()

    await expect(page.getByTestId('comments-list').getByText(replyText)).toBeVisible()
    await expect(page.locator('li[data-sonner-toast]')).toContainText('Reply posted')

    // Reply count should be updated in the blog header and comment header
    expect(await getNumberFlow(page.getByTestId('comment-count'))).toBe('2')
    expect(await getNumberFlow(page.getByTestId('reply-count'))).toBe('1 reply')
  })

  test('should be able to delete a reply', async ({ page }) => {
    const parentId = createId()
    const replyId = createId()
    const user = await getTestUser()

    await db.insert(comments).values({
      id: parentId,
      body: 'Parent Comment',
      postId: 'test-delete-reply',
      userId: user.id
    })

    await db.insert(comments).values({
      id: replyId,
      body: 'Reply comment',
      postId: 'test-delete-reply',
      userId: user.id,
      parentId
    })

    await page.goto('/blog/test-delete-reply')

    const parentCommentBlock = page.getByTestId(`comment-${parentId}`)
    await expect(parentCommentBlock).toBeVisible()

    const expandButton = parentCommentBlock.getByTestId('comment-replies-expand-button')
    await expandButton.click()

    const replyCommentBlock = page.getByTestId(`comment-${replyId}`)
    await expect(replyCommentBlock).toBeVisible()
    await replyCommentBlock.getByTestId('comment-menu-button').click()

    await page.getByTestId('comment-delete-button').click()

    const deleteDialog = page.getByTestId('comment-dialog')
    await expect(deleteDialog).toBeVisible()
    await deleteDialog.getByTestId('comment-dialog-delete-button').click()

    await expect(replyCommentBlock).toBeHidden()
    await expect(page.locator('li[data-sonner-toast]')).toContainText('Deleted a comment')

    // Reply count should be updated in the comment header
    expect(await getNumberFlow(page.getByTestId('comment-count'))).toBe('1')
    expect(await getNumberFlow(page.getByTestId('reply-count'))).toBe('0 replies')
  })
})
