declare module 'eslint-plugin-eslint-comments' {
  import type { ESLint, Linter } from 'eslint'

  declare const eslintCommentsPlugin: ESLint.Plugin & {
    configs: {
      recommended: Linter.Config
    }
  }

  export default eslintCommentsPlugin
}

declare module '@next/eslint-plugin-next' {
  import type { ESLint, Linter } from 'eslint'

  declare const flatConfig: ESLint.Plugin & {
    recommended: Linter.Config
    coreWebVitals: Linter.Config
  }

  export { flatConfig }
}
