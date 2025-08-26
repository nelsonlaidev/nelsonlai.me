import path from 'node:path'

import { expect, test as setup } from '@playwright/test'

const storagePath = path.resolve(import.meta.dirname, '../.auth/user.json')

setup('authenticate', async ({ page }) => {
  // Avoid going to the actual GitHub login page
  await page.route('**/github.com/login/oauth/authorize**', async (route) => {
    const state = new URL(route.request().url()).searchParams.get('state')

    if (!state) {
      throw new Error('Missing state parameter')
    }

    await route.fulfill({
      status: 302,
      headers: {
        location: `http://localhost:3000/api/auth/callback/github?code=mock_github_code&state=${state}`
      }
    })
  })

  await page.goto('/')

  await page.getByTestId('command-menu-button').click()
  await page.locator('[data-value="Sign in"]').click()
  await page.getByTestId('github-sign-in-button').click()

  // After signing in, wait for the getSession (that has response body) API call to complete
  const response = await page.waitForResponse(async (r) => {
    if (r.url().includes('/api/auth/get-session') && r.status() === 200) {
      try {
        const data = await r.json()
        return !!data
      } catch {
        return false
      }
    }

    return false
  })

  expect(response.status()).toBe(200)

  await page.context().storageState({ path: storagePath })
})
