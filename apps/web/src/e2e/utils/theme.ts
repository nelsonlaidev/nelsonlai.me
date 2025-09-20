import { type Browser, expect, type Page } from '@playwright/test'

export const checkAppliedTheme = async (page: Page, theme: string) => {
  const htmlElement = page.locator('html')
  await expect(htmlElement).toHaveClass(new RegExp(String.raw`${theme}`))
  await expect(htmlElement).not.toHaveClass(new RegExp(String.raw`${theme === 'light' ? 'dark' : 'light'}`))
}

export const checkStoredTheme = async (page: Page, theme: 'light' | 'dark' | 'system') => {
  await expect(async () => {
    const storedTheme = await page.evaluate(() => localStorage.getItem('theme'))
    expect(storedTheme).toBe(theme)
  }).toPass()
}

type CreateBrowserContextOptions = {
  baseURL?: string
  colorScheme?: 'light' | 'dark' | 'no-preference'
  localStorage?: Array<{ name: string; value: string }>
}

export const createBrowserContext = async (browser: Browser, options: CreateBrowserContextOptions = {}) => {
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

export const setThemeInLocalStorage = async (page: Page, theme: string) => {
  await page.addInitScript((t: string) => {
    globalThis.localStorage.setItem('theme', t)
  }, theme)
}
