import type { TOC } from '../types'
import type { Heading } from 'mdast'
import type { Plugin } from 'unified'

import Slugger from 'github-slugger'
import { visit } from 'unist-util-visit'

declare module 'mdast' {
  interface Data {
    hProperties?: {
      id?: string
    }
  }
}

const slugger = new Slugger()

export const remarkHeading: Plugin = () => {
  return (tree, file) => {
    const toc: TOC[] = []
    slugger.reset()

    visit(tree, 'heading', (node: Heading) => {
      node.data ??= { hProperties: {} }
      node.data.hProperties ??= {}

      const childNode = node.children[0]

      if (childNode?.type !== 'text') return

      const text = childNode.value
      const id = slugger.slug(childNode.value)

      node.data.hProperties.id = id

      toc.push({
        title: text,
        url: id,
        depth: node.depth
      })

      return 'skip'
    })

    file.data.toc = toc
  }
}
