import NumberFlow from '@number-flow/react'
import { useTranslations } from '@repo/i18n/client'
import { Button, buttonVariants } from '@repo/ui/components/button'
import { toast } from '@repo/ui/components/sonner'
import { cn } from '@repo/utils'
import { cva } from 'cva'
import { ChevronDownIcon, MessageSquareIcon, ThumbsDownIcon, ThumbsUpIcon } from 'lucide-react'

import { useCommentContext } from '@/contexts/comment.context'
import { useCommentsContext } from '@/contexts/comments.context'
import { useVotePostComment } from '@/hooks/queries/post.query'
import { useSession } from '@/lib/auth-client'

const voteVariants = cva({
  base: buttonVariants({
    variant: 'secondary',
    className: 'h-8 gap-1.5 px-2 font-mono text-xs font-medium'
  }),
  variants: {
    active: {
      true: 'bg-accent text-accent-foreground',
      false: 'text-muted-foreground'
    }
  }
})

const CommentActions = () => {
  const { slug } = useCommentsContext()
  const { comment, setIsReplying, isOpenReplies, setIsOpenReplies } = useCommentContext()
  const { data: session } = useSession()
  const t = useTranslations()

  const { mutate: voteComment, isPending: isVoting } = useVotePostComment({ slug })

  const isAuthenticated = session !== null

  const handleVoteComment = (like: boolean) => {
    if (!isAuthenticated) {
      toast.error(t('error.need-logged-in-to-vote'))
      return
    }
    voteComment({ id: comment.id, like: like === comment.liked ? null : like })
  }

  const hasReplies = !comment.parentId && comment.replyCount > 0

  return (
    <>
      <div className='flex gap-1'>
        <Button
          variant='secondary'
          onClick={() => {
            handleVoteComment(true)
          }}
          className={voteVariants({
            active: comment.liked === true
          })}
          aria-label={t('blog.comments.like')}
          disabled={isVoting}
        >
          <ThumbsUpIcon />
          <NumberFlow value={comment.likeCount} />
        </Button>
        <Button
          variant='secondary'
          onClick={() => {
            handleVoteComment(false)
          }}
          className={voteVariants({
            active: comment.liked === false
          })}
          aria-label={t('blog.comments.dislike')}
          disabled={isVoting}
        >
          <ThumbsDownIcon />
          <NumberFlow value={comment.dislikeCount} />
        </Button>
        {comment.parentId ? null : (
          <Button
            variant='secondary'
            className='h-8 gap-1.5 px-2 text-xs font-medium text-muted-foreground'
            onClick={() => {
              setIsReplying(true)
            }}
            data-testid='comment-reply-button'
          >
            <MessageSquareIcon />
            {t('blog.comments.reply')}
          </Button>
        )}
      </div>
      {hasReplies && (
        <Button
          variant='ghost'
          size='sm'
          className='mt-4 h-8 gap-1.5 px-2 text-xs font-medium'
          onClick={() => {
            setIsOpenReplies(!isOpenReplies)
          }}
          data-testid='comment-replies-expand-button'
        >
          <ChevronDownIcon
            className={cn('size-4 transition-transform duration-200', {
              'rotate-180': isOpenReplies
            })}
          />
          <NumberFlow value={comment.replyCount} data-testid='comment-reply-count' />
          {t('blog.comments.replies', { count: comment.replyCount })}
        </Button>
      )}
    </>
  )
}

export default CommentActions
