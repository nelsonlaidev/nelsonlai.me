import type { HighlighterCore } from 'shiki'

import { create } from 'zustand'

type HighlighterStore = {
  highlighter: HighlighterCore | null
  setHighlighter: (highlighter: HighlighterCore | null) => void
}

export const useHighlighterStore = create<HighlighterStore>((set) => ({
  highlighter: null,
  setHighlighter: (highlighter) => {
    set({ highlighter })
  }
}))
