import { useTranslations } from '@repo/i18n/client'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@repo/ui/components/alert-dialog'
import { Button, buttonVariants } from '@repo/ui/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@repo/ui/components/dropdown-menu'
import { toast } from '@repo/ui/components/sonner'
import { MoreVerticalIcon } from 'lucide-react'

import { useCommentContext } from '@/contexts/comment.context'
import { useCommentsContext } from '@/contexts/comments.context'
import { useDeletePostComment } from '@/hooks/queries/post.query'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { useSession } from '@/lib/auth-client'

const CommentMenu = () => {
  const { comment } = useCommentContext()
  const { slug } = useCommentsContext()
  const { data: session } = useSession()
  const [copy] = useCopyToClipboard()
  const t = useTranslations()

  const { mutate: deleteComment, isPending: isDeleting } = useDeletePostComment({ slug }, () => {
    toast.success(t('blog.comments.deleted-a-comment'))
  })

  const {
    isDeleted,
    id,
    user: { id: userId },
    parentId
  } = comment

  const commentQuery = parentId ? `comment=${parentId}&reply=${id}` : `comment=${id}`

  const isAuthor = !isDeleted && session?.user.id === userId

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild={true}>
          <Button
            variant='ghost'
            size='icon'
            className='size-8'
            aria-label={t('blog.comments.open-menu')}
            data-testid='comment-menu-button'
          >
            <MoreVerticalIcon className='size-5' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuItem
            onClick={() =>
              void copy({
                text: `${globalThis.location.origin}/blog/${slug}?${commentQuery}`,
                successMessage: t('blog.comments.link-copied')
              })
            }
          >
            {t('blog.comments.copy-link')}
          </DropdownMenuItem>
          <AlertDialogTrigger asChild={true}>
            {isAuthor && (
              <DropdownMenuItem
                disabled={isDeleting}
                aria-disabled={isDeleting}
                data-testid='comment-delete-button'
                variant='destructive'
              >
                {t('common.delete')}
              </DropdownMenuItem>
            )}
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent data-testid='comment-dialog'>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('blog.comments.delete-a-comment')}</AlertDialogTitle>
          <AlertDialogDescription>{t('blog.comments.confirm-delete-comment')}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              deleteComment({ id })
            }}
            className={buttonVariants({ variant: 'destructive' })}
            data-testid='comment-dialog-delete-button'
          >
            {t('common.delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default CommentMenu
