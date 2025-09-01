import { Link } from '@repo/ui/components/link'
import { TableCell, TableHead, TableHeader, TableRow } from '@repo/ui/components/table'
import MarkdownToJSX from 'markdown-to-jsx'
import { Fragment, memo } from 'react'

import CommentCodeBlock from '../comment-section/comment-code-block'
import CommentTable from '../comment-section/comment-table'

type MarkdownProps = {
  children: string
}

const Markdown = memo((props: MarkdownProps) => {
  const { children } = props

  return (
    <div className='my-3 prose ml-0.5'>
      <MarkdownToJSX
        options={{
          overrides: {
            a: Link,
            pre: CommentCodeBlock,
            table: CommentTable,
            thead: TableHeader,
            tr: TableRow,
            th: TableHead,
            td: TableCell
          },
          disableParsingRawHTML: true,
          wrapper: Fragment
        }}
      >
        {children}
      </MarkdownToJSX>
    </div>
  )
})

Markdown.displayName = 'Markdown'

export default Markdown
