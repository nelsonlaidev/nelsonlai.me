import { defineConfig } from '@nelsonlaidev/eslint-config'

export default defineConfig({
  tsconfigRootDir: import.meta.dirname,
  ignores: ['apps/**', 'packages/**']
})
