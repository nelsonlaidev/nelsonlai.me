import { test } from '@playwright/test'

import { a11y } from '../utils/a11y'
import { createBrowserContext } from '../utils/theme'

test.describe('homepage', () => {
  test('should not have any automatically detectable accessibility issues in light mode', async ({
    page
  }) => {
    await page.goto('/')

    await a11y({ page })
  })

  test('should not have any automatically detectable accessibility issues in dark mode', async ({
    browser,
    baseURL
  }) => {
    const context = await createBrowserContext(browser, {
      baseURL,
      localStorage: [{ name: 'theme', value: 'dark' }]
    })

    const page = await context.newPage()
    await page.goto('/')

    await a11y({ page })
  })
})
