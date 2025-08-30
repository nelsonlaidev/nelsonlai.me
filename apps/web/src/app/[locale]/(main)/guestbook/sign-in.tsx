'use client'

import { useTranslations } from '@repo/i18n/client'
import { Button } from '@repo/ui/components/button'

import { useDialogsStore } from '@/stores/dialogs.store'

const SignIn = () => {
  const t = useTranslations()
  const setIsSignInOpen = useDialogsStore((state) => state.setIsSignInOpen)

  return (
    <>
      <Button
        className='inline-block bg-linear-to-br from-[#fcd34d] via-[#ef4444] to-[#ec4899] font-extrabold dark:text-foreground'
        onClick={() => {
          setIsSignInOpen(true)
        }}
      >
        {t('common.sign-in')}
      </Button>
      <span className='ml-2'>{t('guestbook.signin.description')}</span>
    </>
  )
}

export default SignIn
