import { type Browser, expect, type Page } from '@playwright/test'

export const checkAppliedTheme = async (page: Page, theme: string) => {
  expect(await page.evaluate((t) => document.documentElement.classList.contains(t), theme)).toBe(true)
  expect(await page.evaluate(() => document.documentElement.getAttribute('style'))).toBe(`color-scheme: ${theme};`)
}

export const checkStoredTheme = async (page: Page, expectedTheme: string) => {
  const localStorage = await page.evaluate(() => globalThis.localStorage)
  expect(localStorage.theme).toBe(expectedTheme)
}

type CreateBrowserContextOptions = {
  baseURL?: string
  colorScheme?: 'light' | 'dark' | 'no-preference'
  localStorage?: Array<{ name: string; value: string }>
}

export const createBrowserContext = async (browser: Browser, options: CreateBrowserContextOptions) => {
  return browser.newContext({
    colorScheme: options.colorScheme ?? 'no-preference',
    storageState: {
      cookies: [],
      origins: [
        {
          origin: options.baseURL ?? 'http://localhost:3000',
          localStorage: options.localStorage ?? []
        }
      ]
    }
  })
}
