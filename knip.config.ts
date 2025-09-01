import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  ignoreDependencies: [
    /**
     * Updating knip to 5.63.0 would fix this issue,
     * but 5.61.2 introduced an `isLoadConfig` function that loads our `eslint.config.ts`,
     * causing `eslint-plugin-better-tailwindcss` to have issues loading `tailwindcss/package.json`
     * to find the Tailwind version since the cwd is detected at the root.
     *
     * The function that loads Tailwind version:
     * https://github.com/schoero/eslint-plugin-better-tailwindcss/blob/3a91ac297809e7e1ec47f670aae45999747c7651/src/async-utils/version.ts#L28
     *
     * isLoadConfig function:
     * https://github.com/webpro-nl/knip/blob/e91eea3382059ad4067ace6079e856b2268d9f94/packages/knip/src/plugins/eslint/index.ts#L30-L39
     */
    'tsx',
    // PostCSS is already installed under Next.js
    'postcss'
  ],
  workspaces: {
    'apps/web': {
      entry: ['content-collections.ts', 'src/i18n/request.ts', 'src/e2e/**/*.setup.ts', 'src/e2e/**/*.teardown.ts'],
      ignoreDependencies: [
        // Used in spotify.route.ts
        '@types/spotify-api'
      ]
    },
    'packages/db': {
      entry: ['src/seed.ts', 'src/reset.ts']
    },
    'packages/eslint-config': {
      ignoreDependencies: [
        // https://github.com/typescript-eslint/typescript-eslint/issues/10893
        '@typescript-eslint/utils'
      ]
    },
    'packages/emails': {
      // For tailwindcss intellisense
      ignoreDependencies: ['tailwindcss'],
      ignore: ['src/styles.css']
    }
  },
  // Credit to https://github.com/webpro-nl/knip/issues/1008#issuecomment-2756559038
  compilers: {
    css: (text: string) => [...text.matchAll(/(?<=@)(?:import|plugin)[^;]+/g)].join('\n').replace('plugin', 'import')
  }
}

export default config
