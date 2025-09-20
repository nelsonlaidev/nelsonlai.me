import { test } from '@playwright/test'

import { checkAppliedTheme, checkStoredTheme, setThemeInLocalStorage } from '../utils/theme'

const getInitialTheme = (theme: string) => (theme === 'light' ? 'dark' : 'light')

test.describe('theme', () => {
  test.describe('user interaction', () => {
    for (const theme of ['light', 'dark'] as const) {
      test(`should switch to ${theme} theme via toggle button`, async ({ page }) => {
        const initialTheme = getInitialTheme(theme)

        await setThemeInLocalStorage(page, initialTheme)

        await page.goto('/')

        await checkAppliedTheme(page, initialTheme)

        await page.getByTestId('theme-toggle').click()
        await page.getByTestId(`theme-${theme}-button`).click()

        await checkAppliedTheme(page, theme)
        await checkStoredTheme(page, theme)
      })
    }
  })

  test.describe('system preference', () => {
    const testCases = [
      { preferredColorScheme: 'light', expectedTheme: 'light' },
      { preferredColorScheme: 'dark', expectedTheme: 'dark' }
    ] as const

    for (const { preferredColorScheme, expectedTheme } of testCases) {
      test(`should render ${expectedTheme} theme if preferred-colorscheme is ${preferredColorScheme}`, async ({
        page
      }) => {
        await page.emulateMedia({ colorScheme: preferredColorScheme })

        await setThemeInLocalStorage(page, 'system')

        await page.goto('/')

        await checkStoredTheme(page, 'system')
        await checkAppliedTheme(page, expectedTheme)
      })
    }
  })

  test.describe('storage persistence', () => {
    for (const theme of ['light', 'dark'] as const) {
      test(`should render ${theme} theme directly from localStorage`, async ({ page }) => {
        await setThemeInLocalStorage(page, theme)

        await page.goto('/')

        await checkStoredTheme(page, theme)
        await checkAppliedTheme(page, theme)
      })
    }
  })
})
