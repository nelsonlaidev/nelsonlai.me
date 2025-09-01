import { useTranslations } from '@repo/i18n/client'
import { MessageCircleIcon, PinIcon } from 'lucide-react'

const Pinned = () => {
  const t = useTranslations()

  return (
    <div className='relative overflow-hidden rounded-lg border text-card-foreground shadow-xs'>
      <div className='absolute inset-0 bg-linear-to-br from-blue-50/80 via-purple-50/50 to-rose-50/30 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-rose-900/10' />

      <div className='absolute top-4 right-4'>
        <PinIcon className='size-5 rotate-45 text-muted-foreground/50' />
      </div>

      <div className='relative p-6'>
        <div className='flex items-start gap-4'>
          <div className='hidden size-10 shrink-0 items-center justify-center rounded-full bg-primary/5 sm:flex dark:bg-primary/10'>
            <MessageCircleIcon className='size-5 text-primary' />
          </div>
          <div className='space-y-4'>
            <h2 className='text-xl font-semibold text-foreground'>{t('guestbook.pinned.greeting')}</h2>
            <p className='text-muted-foreground'>{t('guestbook.pinned.description')}</p>
          </div>
        </div>
      </div>

      <div className='h-1 w-full bg-linear-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 dark:from-blue-400/40 dark:via-purple-400/40 dark:to-pink-400/40' />
    </div>
  )
}

export default Pinned
