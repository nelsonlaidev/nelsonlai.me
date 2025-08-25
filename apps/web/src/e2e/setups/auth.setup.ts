import path from 'node:path'

import { test as setup } from '@playwright/test'

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

  await page.goto('http://localhost:3000/')

  await page.getByTestId('command-menu-button').click()
  await page.locator('[data-value="Sign in"]').click()
  await page.getByTestId('github-sign-in-button').click()

  await new Promise((resolve) => setTimeout(resolve, 5000))

  await page.context().storageState({ path: storagePath })
})
