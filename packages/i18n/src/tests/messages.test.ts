import { describe, expect, it } from 'vitest'

import { i18n } from '../config'
import { flattenKeys, loadMessages } from '../utils'

describe('i18n messages', () => {
  it('should have matching keys across all languages', async () => {
    const defaultMessages = await loadMessages(i18n.defaultLocale)
    const defaultKeys = flattenKeys(defaultMessages)

    for (const locale of i18n.locales) {
      if (locale === i18n.defaultLocale) continue

      const messages = await loadMessages(locale)
      const messageKeys = flattenKeys(messages)

      // Check if all default keys exist in current locale
      for (const key of defaultKeys) {
        expect(messageKeys).toContain(key)
      }

      // Check if all locale keys exist in default
      for (const key of messageKeys) {
        expect(defaultKeys).toContain(key)
      }
    }
  })
})
