import { useTranslations } from '@repo/i18n/client'
import { MessageCircleIcon, PinIcon } from 'lucide-react'

const Pinned = () => {
  const t = useTranslations()

  return (
    <div className='text-card-foreground shadow-xs relative overflow-hidden rounded-lg border'>
      <div className='bg-linear-to-br absolute inset-0 from-blue-50/80 via-purple-50/50 to-rose-50/30 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-rose-900/10' />

      <div className='absolute right-4 top-4'>
        <PinIcon className='text-muted-foreground/50 size-5 rotate-45' />
      </div>

      <div className='relative p-6'>
        <div className='flex items-start gap-4'>
          <div className='bg-primary/5 dark:bg-primary/10 hidden size-10 shrink-0 items-center justify-center rounded-full sm:flex'>
            <MessageCircleIcon className='text-primary size-5' />
          </div>
          <div className='space-y-4'>
            <h2 className='text-foreground text-xl font-semibold'>{t('guestbook.pinned.greeting')}</h2>
            <p className='text-muted-foreground'>{t('guestbook.pinned.description')}</p>
          </div>
        </div>
      </div>

      <div className='bg-linear-to-r h-1 w-full from-blue-500/30 via-purple-500/30 to-pink-500/30 dark:from-blue-400/40 dark:via-purple-400/40 dark:to-pink-400/40' />
    </div>
  )
}

export default Pinned
