import { useTranslations } from '@repo/i18n/client'
import { Button } from '@repo/ui/components/button'

import { useDialogsStore } from '@/stores/dialogs.store'

const UnauthorizedOverlay = () => {
  const t = useTranslations()
  const setIsSignInOpen = useDialogsStore((state) => state.setIsSignInOpen)

  return (
    <div className='absolute inset-0 flex items-center justify-center rounded-lg bg-black/5 backdrop-blur-[0.8px]'>
      <Button
        size='sm'
        onClick={() => {
          setIsSignInOpen(true)
        }}
      >
        {t('common.sign-in')}
      </Button>
    </div>
  )
}

export default UnauthorizedOverlay
