import type messages from '@repo/i18n/messages/en.json'
import type { routing } from '@repo/i18n/routing'

declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof routing.locales)[number]
    Messages: typeof messages
  }
}
