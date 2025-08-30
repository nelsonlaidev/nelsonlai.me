import { CodeBlock } from '@repo/ui/components/code-block'
import { useEffect, useState } from 'react'
import { type BundledLanguage, bundledLanguages } from 'shiki'

import { useHighlighterStore } from '@/stores/highlighter.store'

type CommentCodeBlockProps = {
  children: {
    props: {
      children: string
      className?: string
      title?: string
    }
  }
}

const CommentCodeBlock = (props: CommentCodeBlockProps) => {
  const {
    children: {
      props: { children: code, className, title }
    }
  } = props
  const lang = className?.replace('lang-', '') ?? 'plaintext'
  const highlighter = useHighlighterStore((state) => state.highlighter)
  const [highlightedHtml, setHighlightedHtml] = useState('')
  const [isHighlighted, setIsHighlighted] = useState(false)

  useEffect(() => {
    if (!highlighter) return

    const generateHighlightedHtml = async () => {
      const loadedLanguages = highlighter.getLoadedLanguages()
      const hasLoadedLanguage = loadedLanguages.includes(lang)
      const bundledLang = bundledLanguages[lang as BundledLanguage]

      if (!hasLoadedLanguage) {
        await highlighter.loadLanguage(bundledLang)
      }

      return highlighter.codeToHtml(code, {
        lang: lang in bundledLanguages ? lang : 'plaintext',
        themes: {
          light: 'github-light-default',
          dark: 'github-dark-default'
        },
        defaultColor: false
      })
    }

    generateHighlightedHtml().then((newHtml) => {
      setHighlightedHtml(newHtml)
      setIsHighlighted(true)
    })
  }, [code, highlighter, lang])

  const codeHtml = /<code\b[^>]*>([\s\S]*?)<\/code>/.exec(highlightedHtml)?.[1]

  return (
    <CodeBlock data-lang={lang} title={title} className='shiki' figureClassName='my-2' scrollAreaClassName='h-120'>
      {isHighlighted && codeHtml ? (
        <code
          dangerouslySetInnerHTML={{
            __html: codeHtml
          }}
        />
      ) : (
        <code>{code}</code>
      )}
    </CodeBlock>
  )
}

export default CommentCodeBlock
