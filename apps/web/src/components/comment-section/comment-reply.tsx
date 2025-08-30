'use client'

import { useTranslations } from '@repo/i18n/client'
import { Button } from '@repo/ui/components/button'
import { toast } from '@repo/ui/components/sonner'
import { useState } from 'react'

import { useCommentContext } from '@/contexts/comment.context'
import { useCommentsContext } from '@/contexts/comments.context'
import { useCreatePostComment } from '@/hooks/queries/post.query'
import { useSession } from '@/lib/auth-client'

import CommentEditor from './comment-editor'
import UnauthorizedOverlay from './unauthorized-overlay'

const CommentReply = () => {
  const [content, setContent] = useState('')
  const { data: session } = useSession()
  const { comment, setIsReplying } = useCommentContext()
  const { slug } = useCommentsContext()
  const t = useTranslations()

  const { mutate: createReply, isPending: isCreating } = useCreatePostComment({ slug }, () => {
    setIsReplying(false)
    toast.success(t('blog.comments.reply-posted'))
  })

  const submitCommentReply = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault()

    if (!content) {
      toast.error(t('error.reply-cannot-be-empty'))
      return
    }

    createReply({
      slug,
      content,
      parentId: comment.id,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    })
  }

  const isAuthenticated = session !== null
  const disabled = !isAuthenticated || isCreating

  return (
    <form onSubmit={submitCommentReply}>
      <div className='relative'>
        <CommentEditor
          onChange={(e) => setContent(e.target.value)}
          onModEnter={submitCommentReply}
          onEscape={() => setIsReplying(false)}
          placeholder={t('blog.comments.reply-to-comment')}
          disabled={disabled}
          // eslint-disable-next-line jsx-a11y/no-autofocus -- autofocus is necessary because user is replying to a comment
          autoFocus
          data-testid='comment-textarea-reply'
        />
        {isAuthenticated ? null : <UnauthorizedOverlay />}
      </div>
      <div className='mt-2 space-x-1'>
        <Button
          variant='secondary'
          className='h-8 px-2 text-xs font-medium'
          type='submit'
          disabled={disabled || !content}
          aria-disabled={disabled || !content}
          data-testid='comment-submit-reply-button'
        >
          {t('blog.comments.reply')}
        </Button>
        <Button variant='secondary' className='h-8 px-2 text-xs font-medium' onClick={() => setIsReplying(false)}>
          {t('common.cancel')}
        </Button>
      </div>
    </form>
  )
}

export default CommentReply
