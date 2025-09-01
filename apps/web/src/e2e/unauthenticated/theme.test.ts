import { test } from '@playwright/test'

import { checkAppliedTheme, checkStoredTheme, createBrowserContext } from '../utils/theme'

const createThemeTest = (theme: 'light' | 'dark') => {
  test(`should render ${theme} theme`, async ({ browser, baseURL }) => {
    const context = await createBrowserContext(browser, {
      baseURL,
      localStorage: [{ name: 'theme', value: theme }]
    })

    const page = await context.newPage()
    await page.goto('/')

    await page.getByTestId('theme-toggle').click()
    await page.getByTestId(`theme-${theme}-button`).click()

    await checkStoredTheme(page, theme)
    await checkAppliedTheme(page, theme)

    await context.close()
  })
}

const createSystemThemeTest = (path: string, preferredColorScheme: 'light' | 'dark', expectedTheme: string) => {
  test(`should render ${expectedTheme} theme if preferred-colorscheme is ${preferredColorScheme}`, async ({
    browser,
    baseURL
  }) => {
    const context = await createBrowserContext(browser, {
      colorScheme: preferredColorScheme,
      baseURL,
      localStorage: [{ name: 'theme', value: 'system' }]
    })

    const page = await context.newPage()
    await page.goto(path)

    await checkStoredTheme(page, 'system')
    await checkAppliedTheme(page, expectedTheme)
  })
}

const createStorageThemeTest = (theme: 'light' | 'dark') => {
  test(`should render ${theme} theme from localStorage`, async ({ browser, baseURL }) => {
    const context = await createBrowserContext(browser, {
      baseURL,
      localStorage: [{ name: 'theme', value: theme }]
    })

    const page = await context.newPage()
    await page.goto('/')

    await checkStoredTheme(page, theme)
    await checkAppliedTheme(page, theme)

    await context.close()
  })
}

test.describe('theme', () => {
  createThemeTest('light')
  createThemeTest('dark')
  createSystemThemeTest('/', 'light', 'light')
  createSystemThemeTest('/', 'dark', 'dark')
  createStorageThemeTest('light')
  createStorageThemeTest('dark')
})
