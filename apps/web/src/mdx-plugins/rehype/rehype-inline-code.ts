/**
 * vocs (MIT License)
 * Copyright (c) weth, LLC
 * Source: https://github.com/wevm/vocs/blob/75e0cfc874e7abe8648be139a8554e1fe87a18d1/src/vite/plugins/rehype/inline-shiki.ts
 *
 * shiki (MIT License)
 * Copyright (c) Pine Wu and Anthony Fu
 * Source: https://github.com/shikijs/shiki/blob/481135b16287d7dabc2e155f427af63d3ff3536d/packages/rehype/src/index.ts
 *
 * Modified by: Nelson Lai
 */
import type { RehypeShikiCoreOptions } from '@shikijs/rehype/core'
import type { Root } from 'hast'
import type { Plugin } from 'unified'

import { bundledLanguages, getSingletonHighlighter, type Highlighter } from 'shiki'
import { visit } from 'unist-util-visit'

import { DEFAULT_SHIKI_THEMES } from './rehype-code'

const inlineShikiRegex = /^(.*?){:(.*)}$/

const themeNames = Object.values(DEFAULT_SHIKI_THEMES)
const themeKeys = Object.keys(DEFAULT_SHIKI_THEMES)

let cachedHighlighter: Highlighter | null = null

const getHighlighter = async () => {
  if (cachedHighlighter) return cachedHighlighter

  cachedHighlighter = await getSingletonHighlighter({
    themes: themeNames,
    langs: Object.keys(bundledLanguages)
  })

  return cachedHighlighter
}

export const rehypeInlineCode: Plugin<[RehypeShikiCoreOptions], Root> = () => {
  return async (tree) => {
    const highlighter = await getHighlighter()

    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'code') return

      const childNode = node.children[0]

      if (childNode?.type !== 'text') return

      const match = inlineShikiRegex.exec(childNode.value)
      if (!match) return

      const [, code, lang] = match

      if (!code || !lang) return

      const isLang = !lang.startsWith('.')

      const hast = highlighter.codeToHast(code, {
        themes: DEFAULT_SHIKI_THEMES,
        lang: isLang ? lang : 'plaintext',
        defaultColor: false
      })

      const preNode = hast.children[0]

      if (preNode?.type !== 'element') return
      if (preNode.tagName !== 'pre') return

      const inlineCode = preNode.children[0]
      if (inlineCode?.type !== 'element') return

      /**
       * Set the color by scope if language is not specified
       * @example `myFunction{:.entity.name.function}`
       */
      if (!isLang) {
        const colors = themeNames.map(
          (name) =>
            highlighter.getTheme(name).settings.find(({ scope }) => scope?.includes(lang.slice(1)))?.settings
              .foreground ?? 'inherit'
        )

        const spanNode = inlineCode.children[0]

        if (spanNode?.type !== 'element') return
        if (spanNode.tagName !== 'span') return

        spanNode.properties.style = themeKeys.map((key, i) => `--shiki-${key}:${colors[i]}`).join(';')
      }

      inlineCode.properties.className = ['shiki']

      parent?.children.splice(index ?? 0, 1, inlineCode)
    })
  }
}
