import type { ListMessagesOutput } from '@/orpc/routers'

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
import { toast } from '@repo/ui/components/sonner'

import { useDeleteGuestbookMessage } from '@/hooks/queries/guestbook.query'

type DeleteButtonProps = {
  message: ListMessagesOutput['messages'][number]
}

const DeleteButton = (props: DeleteButtonProps) => {
  const { message } = props
  const t = useTranslations()

  const { mutate: deleteMessage, isPending: isDeleting } = useDeleteGuestbookMessage(() => {
    toast.success(t('guestbook.delete-message-successfully'))
  })

  const handleDeleteMessage = (id: string) => {
    deleteMessage({ id })
  }

  return (
    <div className='mt-4 flex justify-end'>
      <AlertDialog>
        <AlertDialogTrigger asChild={true}>
          <Button
            variant='destructive'
            disabled={isDeleting}
            aria-disabled={isDeleting}
            data-testid='guestbook-delete-button'
          >
            {t('common.delete')}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent data-testid='guestbook-dialog'>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('guestbook.delete-dialog.title')}</AlertDialogTitle>
            <AlertDialogDescription>{t('guestbook.delete-dialog.description')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleDeleteMessage(message.id)
              }}
              className={buttonVariants({ variant: 'destructive' })}
              data-testid='guestbook-dialog-delete-button'
            >
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default DeleteButton
