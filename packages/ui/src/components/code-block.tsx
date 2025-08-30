'use client'

import { cn } from '@repo/utils'
import { CheckIcon, CopyIcon } from 'lucide-react'
import mergeRefs from 'merge-refs'
import { useEffect, useRef, useState } from 'react'

import { getIconByLanguage } from '../utils/get-icon-by-language'

import { Button } from './button'
import { ScrollArea, ScrollBar } from './scroll-area'

type CodeBlockProps = {
  'data-lang'?: string
  figureClassName?: string
  scrollAreaClassName?: string
} & React.ComponentProps<'pre'>

const CodeBlock = (props: CodeBlockProps) => {
  const { children, className, title, 'data-lang': lang, figureClassName, scrollAreaClassName, ref, ...rest } = props

  const textInput = useRef<HTMLPreElement>(null)
  const Icon = getIconByLanguage(lang ?? '')

  const onCopy = () => {
    void navigator.clipboard.writeText(textInput.current?.textContent ?? '')
  }

  return (
    <figure
      className={cn(
        'not-prose bg-secondary/50 group relative my-6 overflow-hidden rounded-lg border text-sm',
        figureClassName
      )}
    >
      {title ? (
        <div className='bg-muted/50 flex flex-row items-center gap-2 border-b px-4 py-1.5'>
          <div className='text-muted-foreground'>
            <Icon className='size-3.5' />
          </div>
          <figcaption className='text-muted-foreground flex-1 truncate'>{title}</figcaption>
          <CopyButton className='-me-2' onCopy={onCopy} />
        </div>
      ) : (
        <CopyButton className='absolute right-2 top-2 z-10' onCopy={onCopy} />
      )}

      <ScrollArea className={scrollAreaClassName}>
        <pre ref={mergeRefs(textInput, ref)} className={cn('p-4 text-[13px]', className)} {...rest}>
          {children}
        </pre>
        <ScrollBar orientation='horizontal' />
      </ScrollArea>
    </figure>
  )
}

type CopyButtonProps = {
  onCopy: () => void
} & React.ComponentProps<typeof Button>

const CopyButton = (props: CopyButtonProps) => {
  const { onCopy, className, ...rest } = props
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    const copyResetTimeoutId = setTimeout(() => setIsCopied(false), 2000)

    return () => clearTimeout(copyResetTimeoutId)
  }, [isCopied])

  return (
    <Button
      variant='ghost'
      size='icon'
      onClick={() => {
        onCopy()
        setIsCopied(true)
      }}
      className={cn('size-7.5 opacity-0 transition-opacity group-hover:opacity-100', className)}
      aria-label='Copy code to clipboard'
      {...rest}
    >
      {isCopied ? <CheckIcon className='size-3.5' /> : <CopyIcon className='size-3.5' />}
    </Button>
  )
}

export { CodeBlock }
