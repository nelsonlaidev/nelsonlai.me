import { type Browser, expect, type Page } from '@playwright/test'

export const checkAppliedTheme = async (page: Page, theme: string) => {
  expect(await page.evaluate((t) => document.documentElement.classList.contains(t), theme)).toBe(true)
  expect(await page.evaluate(() => document.documentElement.getAttribute('style'))).toBe(`color-scheme: ${theme};`)
}

export const checkStoredTheme = async (page: Page, expectedTheme: string) => {
  const localStorage = await page.evaluate(() => globalThis.localStorage)
  expect(localStorage.theme).toBe(expectedTheme)
}

export const createBrowserContext = async (browser: Browser) => {
  return browser.newContext({
    colorScheme: 'no-preference',
    storageState: {
      cookies: [],
      origins: [
        {
          origin: 'http://localhost:3000',
          localStorage: []
        }
      ]
    }
  })
}

export const setThemeInLocalStorage = async (page: Page, theme: string) => {
  await page.addInitScript((t: string) => {
    globalThis.localStorage.setItem('theme', t)
  }, theme)
}
