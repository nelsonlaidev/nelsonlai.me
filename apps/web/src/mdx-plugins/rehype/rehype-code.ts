/**
 * fumadocs (MIT License)
 * Copyright (c) fuma-nama
 * Source: https://github.com/fuma-nama/fumadocs/blob/7b18075cc97ca876ab14b22f05349a09dc0e4025/packages/core/src/mdx-plugins/rehype-code.ts
 *
 * Modified by: Nelson Lai
 */
import type { Root } from 'hast'
import type { Plugin } from 'unified'

import { type RehypeShikiOptions } from '@shikijs/rehype'
import rehypeShikiFromHighlighter from '@shikijs/rehype/core'
import {
  transformerNotationDiff,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerNotationWordHighlight
} from '@shikijs/transformers'
import { bundledLanguages, getSingletonHighlighter, type ShikiTransformer } from 'shiki'
import { createOnigurumaEngine } from 'shiki/engine/oniguruma'

const titleRegex = /title=["']([^"']*)["']/

export const DEFAULT_SHIKI_THEMES = {
  light: 'github-light-default',
  dark: 'github-dark-default'
}

export const rehypeCode: Plugin<[RehypeShikiOptions], Root> = () => {
  const transformers: ShikiTransformer[] = [
    {
      /**
       * - Remove trailing newline
       * - Remove title from meta
       * @param code
       * @param root0
       * @param root0.meta
       */
      preprocess(code, { meta }) {
        if (meta) {
          meta.__raw = meta.__raw?.replace(titleRegex, '')
        }
        return code.replace(/\n$/, '')
      },
      root(hast) {
        const pre = hast.children[0]
        if (pre?.type !== 'element') return
        hast.children = [
          {
            ...pre,
            properties: {
              ...pre.properties,
              'data-lang': this.options.lang
            }
          }
        ]
      }
    },
    transformerNotationHighlight({
      matchAlgorithm: 'v3'
    }),
    transformerNotationWordHighlight({
      matchAlgorithm: 'v3'
    }),
    transformerNotationDiff({
      matchAlgorithm: 'v3'
    }),
    transformerNotationFocus({
      matchAlgorithm: 'v3'
    })
  ]

  const highlighter = getSingletonHighlighter({
    engine: createOnigurumaEngine(import('shiki/wasm')),
    themes: Object.values(DEFAULT_SHIKI_THEMES),
    langs: Object.keys(bundledLanguages)
  })

  const transformer = highlighter.then((instance) =>
    rehypeShikiFromHighlighter(instance, {
      themes: DEFAULT_SHIKI_THEMES,
      defaultColor: false,
      defaultLanguage: 'plaintext',
      transformers,
      parseMetaString: (meta) => {
        const titleMatch = titleRegex.exec(meta)
        const title = titleMatch?.[1] ?? null

        return { title }
      }
    })
  )

  return async (tree, file) => {
    await (
      await transformer
    )(tree, file, () => {
      // Do nothing
    })
  }
}
