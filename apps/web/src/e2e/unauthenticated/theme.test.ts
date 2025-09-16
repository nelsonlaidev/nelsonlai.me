import { type BrowserContext, test } from '@playwright/test'

import { checkAppliedTheme, checkStoredTheme, createBrowserContext, setThemeInLocalStorage } from '../utils/theme'

test.describe('theme', () => {
  let context: BrowserContext

  test.beforeAll(async ({ browser }) => {
    context = await createBrowserContext(browser)
  })

  test.afterAll(async () => {
    await context.close()
  })

  const createThemeTest = (theme: 'light' | 'dark') => {
    test(`should render ${theme} theme`, async () => {
      const page = await context.newPage()
      await setThemeInLocalStorage(page, theme)
      await page.goto('/')

      await page.getByTestId('theme-toggle').click()
      await page.getByTestId(`theme-${theme}-button`).click()

      await checkStoredTheme(page, theme)
      await checkAppliedTheme(page, theme)

      await context.close()
    })
  }

  const createSystemThemeTest = (path: string, preferredColorScheme: 'light' | 'dark', expectedTheme: string) => {
    test(`should render ${expectedTheme} theme if preferred-colorscheme is ${preferredColorScheme}`, async () => {
      const page = await context.newPage()
      await page.emulateMedia({ colorScheme: preferredColorScheme })
      await setThemeInLocalStorage(page, 'system')
      await page.goto(path)

      await checkStoredTheme(page, 'system')
      await checkAppliedTheme(page, expectedTheme)
    })
  }

  const createStorageThemeTest = (theme: 'light' | 'dark') => {
    test(`should render ${theme} theme from localStorage`, async () => {
      const page = await context.newPage()
      await setThemeInLocalStorage(page, theme)
      await page.goto('/')

      await checkStoredTheme(page, theme)
      await checkAppliedTheme(page, theme)

      await context.close()
    })
  }

  createThemeTest('light')
  createThemeTest('dark')
  createSystemThemeTest('/', 'light', 'light')
  createSystemThemeTest('/', 'dark', 'dark')
  createStorageThemeTest('light')
  createStorageThemeTest('dark')
})
