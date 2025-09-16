import { defineConfig, GLOB_SRC_EXT } from '@nelsonlaidev/eslint-config'

export default defineConfig({
  tailwindEntryPoint: './src/styles/globals.css',
  playwrightGlob: `./src/e2e/**/*.test.${GLOB_SRC_EXT}`,
  vitestGlob: `./src/tests/**/*.test.${GLOB_SRC_EXT}`,
  overrides: {
    tailwindcss: {
      'better-tailwindcss/no-unregistered-classes': ['error', { ignore: ['not-prose', 'shiki'] }]
    }
  }
})
