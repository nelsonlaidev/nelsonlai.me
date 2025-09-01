import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  ignoreDependencies: [
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
