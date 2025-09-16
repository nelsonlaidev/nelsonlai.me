import { defineConfig } from '@nelsonlaidev/eslint-config'

export default defineConfig({
  tailwindEntryPoint: './src/styles/globals.css',
  playwrightGlob: './src/e2e/**/*.test.ts',
  vitestGlob: './src/tests/**/*.test.{ts,tsx}',
  overrides: {
    tailwindcss: {
      'better-tailwindcss/no-unregistered-classes': ['error', { ignore: ['not-prose', 'shiki'] }]
    }
  }
})
