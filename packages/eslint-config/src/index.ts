import eslint from '@eslint/js'
import reactPlugin from '@eslint-react/eslint-plugin'
import { flatConfig as nextPlugin } from '@next/eslint-plugin-next'
import gitignore from 'eslint-config-flat-gitignore'
// @ts-expect-error -- no types
import eslintCommentsPlugin from 'eslint-plugin-eslint-comments'
import importPlugin from 'eslint-plugin-import'
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y'
import playwrightPlugin from 'eslint-plugin-playwright'
import prettierPlugin from 'eslint-plugin-prettier/recommended'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort'
import sonarjsPlugin from 'eslint-plugin-sonarjs'
import testingLibraryPlugin from 'eslint-plugin-testing-library'
import turboPlugin from 'eslint-plugin-turbo'
import unicornPlugin from 'eslint-plugin-unicorn'
import unusedImportsPlugin from 'eslint-plugin-unused-imports'
import globals from 'globals'
import tseslint from 'typescript-eslint'

type Options = {
  tsconfigRootDir: string
  ignores?: string[]
  next?: boolean
  tailwindEntryPoint?: string
}

export const defineConfig = async (options: Options) => {
  const { tsconfigRootDir, ignores = [], next, tailwindEntryPoint } = options

  const config = tseslint.config(
    gitignore(),

    { ignores: [...ignores] },

    eslint.configs.recommended,

    tseslint.configs.strictTypeChecked,
    tseslint.configs.stylisticTypeChecked,
    {
      languageOptions: {
        parserOptions: {
          projectService: true,
          tsconfigRootDir,
          globals: {
            ...globals.browser,
            ...globals.node,
            ...globals.es2022,
            document: 'readonly',
            navigator: 'readonly',
            window: 'readonly'
          }
        }
      },
      linterOptions: {
        reportUnusedDisableDirectives: 'error',
        reportUnusedInlineConfigs: 'error'
      }
    },
    {
      rules: {
        '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
        '@typescript-eslint/no-invalid-this': 'error',
        '@typescript-eslint/no-shadow': 'error',
        '@typescript-eslint/consistent-type-imports': [
          'error',
          {
            prefer: 'type-imports',
            fixStyle: 'inline-type-imports'
          }
        ],
        '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
        '@typescript-eslint/no-confusing-void-expression': [
          'error',
          {
            ignoreArrowShorthand: true,
            ignoreVoidOperator: true,
            ignoreVoidReturningFunctions: true
          }
        ],

        '@typescript-eslint/no-namespace': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/consistent-type-definitions': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',

        // Turn off due to poor performance
        '@typescript-eslint/no-misused-promises': 'off',
        '@typescript-eslint/no-floating-promises': 'off'
      }
    },

    {
      plugins: {
        'unused-imports': unusedImportsPlugin
      },
      rules: {
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'off',

        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': [
          'error',
          {
            vars: 'all',
            varsIgnorePattern: '^_',
            args: 'after-used',
            argsIgnorePattern: '^_'
          }
        ]
      }
    },

    unicornPlugin.configs.recommended,
    {
      rules: {
        'unicorn/no-await-expression-member': 'off',
        'unicorn/no-null': 'off',
        'unicorn/prefer-export-from': ['error', { ignoreUsedVariables: true }],
        'unicorn/prevent-abbreviations': 'off',
        'unicorn/prefer-string-raw': 'off',
        'unicorn/prefer-spread': 'off'
      }
    },

    {
      plugins: {
        'eslint-comments': eslintCommentsPlugin
      },
      rules: {
        ...eslintCommentsPlugin.configs.recommended.rules,

        'eslint-comments/require-description': 'error'
      }
    },

    {
      plugins: {
        'simple-import-sort': simpleImportSortPlugin
      },
      rules: {
        'simple-import-sort/imports': [
          'error',
          {
            groups: [
              // Type imports
              [
                '^.*\\u0000$',
                '^node:.*\\u0000$',
                '^@?\\w.*\\u0000$',
                '^\\.\\..*\\u0000$',
                '^\\..*\\u0000$'
              ],

              // Side effect imports (e.g., `import 'some-module'`)
              ['^\\u0000'],

              // Node.js builtins prefixed with `node:`
              ['^node:'],

              // Things that start with a letter (or digit or underscore), or `@` followed by a letter
              ['^@?\\w'],

              // Absolute imports (e.g., `import something from 'src/utils'`)
              ['^[^.]'],

              // Parent directory relative imports (e.g., `import something from '../utils'`)
              ['^\\.\\.'],

              // Current directory relative imports (e.g., `import something from './utils'`)
              ['^\\.']
            ]
          }
        ],
        'simple-import-sort/exports': 'error'
      }
    },

    sonarjsPlugin.configs.recommended,
    {
      rules: {
        'sonarjs/no-duplicate-string': 'off',
        'sonarjs/no-nested-functions': 'off',
        'sonarjs/no-commented-code': 'off',
        'sonarjs/pseudo-random': 'off',
        'sonarjs/function-return-type': 'off'
      }
    },

    importPlugin.flatConfigs.typescript,
    {
      rules: {
        'import/no-amd': 'error',
        'import/no-commonjs': 'error',
        'import/first': 'error',
        'import/no-duplicates': 'error',
        'import/no-mutable-exports': 'error',
        'import/no-named-default': 'error',
        'import/no-self-import': 'error',
        'import/no-webpack-loader-syntax': 'error',
        'import/newline-after-import': ['error', { count: 1 }]
      }
    },

    reactPlugin.configs.all,
    {
      rules: {
        // @eslint-react
        '@eslint-react/no-leaked-conditional-rendering': 'error',
        '@eslint-react/avoid-shorthand-boolean': 'off',
        '@eslint-react/avoid-shorthand-fragment': 'off',
        '@eslint-react/prefer-destructuring-assignment': 'off',
        '@eslint-react/no-array-index-key': 'off',
        '@eslint-react/no-complex-conditional-rendering': 'off',
        '@eslint-react/jsx-uses-react': 'off',

        // @eslint-react/hooks-extra
        '@eslint-react/hooks-extra/no-direct-set-state-in-use-effect': 'off',

        // @eslint-react/dom
        '@eslint-react/dom/no-dangerously-set-innerhtml': 'off',

        // @eslint-react/naming-convention
        '@eslint-react/naming-convention/filename': ['error', { rule: 'kebab-case' }]
      }
    },

    reactHooksPlugin.configs['recommended-latest'],

    jsxA11yPlugin.flatConfigs.strict,
    {
      rules: {
        'jsx-a11y/alt-text': [
          'error',
          {
            elements: ['img'],
            img: ['Image']
          }
        ],
        'jsx-a11y/lang': 'error',
        'jsx-a11y/no-aria-hidden-on-focusable': 'error',
        'jsx-a11y/no-noninteractive-element-to-interactive-role': [
          'error',
          {
            ul: ['listbox', 'menu', 'menubar', 'radiogroup', 'tablist', 'tree', 'treegrid'],
            ol: ['listbox', 'menu', 'menubar', 'radiogroup', 'tablist', 'tree', 'treegrid'],
            li: ['menuitem', 'option', 'row', 'tab', 'treeitem'],
            table: ['grid'],
            td: ['gridcell']
          }
        ]
      },
      settings: {
        'jsx-a11y': {
          components: {
            Button: 'button',
            Image: 'img',
            Input: 'input',
            Textarea: 'textarea',
            Link: 'a'
          }
        }
      }
    },

    turboPlugin.configs['flat/recommended'],

    {
      ...playwrightPlugin.configs['flat/recommended'],
      files: ['**/e2e/**/*.{test,spec}.{ts,tsx}'],
      rules: {
        ...playwrightPlugin.configs['flat/recommended'].rules,

        'playwright/expect-expect': [
          'error',
          { assertFunctionNames: ['a11y', 'checkStoredTheme', 'checkAppliedTheme'] }
        ]
      }
    },

    {
      ...testingLibraryPlugin.configs['flat/react'],
      files: ['**/tests/**/*.{test,spec}.{ts,tsx}']
    }
  )

  if (next) {
    // @ts-expect-error -- no types
    config.push(nextPlugin.coreWebVitals)
  }

  if (tailwindEntryPoint) {
    const { default: tailwindPlugin } = await import('eslint-plugin-better-tailwindcss')

    config.push({
      plugins: {
        'better-tailwindcss': tailwindPlugin
      },
      rules: {
        'better-tailwindcss/enforce-consistent-variable-syntax': 'error',
        'better-tailwindcss/no-conflicting-classes': 'error',
        'better-tailwindcss/no-unregistered-classes': [
          'error',
          { ignore: ['not-prose', 'toaster', 'shiki'] }
        ]
      },
      settings: {
        'better-tailwindcss': {
          entryPoint: tailwindEntryPoint
        }
      }
    })
  }

  // Must be last
  config.push(prettierPlugin)

  return config
}
