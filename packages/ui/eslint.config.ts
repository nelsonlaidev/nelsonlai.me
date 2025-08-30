import { defineConfig } from '@nelsonlaidev/eslint-config'

export default defineConfig({
  tsconfigRootDir: import.meta.dirname,
  tailwindEntryPoint: './src/styles/main.css',
  nextjs: false
})
