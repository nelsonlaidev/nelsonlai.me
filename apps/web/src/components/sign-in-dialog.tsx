'use client'

import { SiGithub } from '@icons-pack/react-simple-icons'
import { useTranslations } from '@repo/i18n/client'
import { usePathname } from '@repo/i18n/routing'
import { Badge } from '@repo/ui/components/badge'
import { Button } from '@repo/ui/components/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@repo/ui/components/dialog'
import { toast } from '@repo/ui/components/sonner'
import { LoaderIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'

import { signIn } from '@/lib/auth-client'
import { useDialogsStore } from '@/stores/dialogs.store'

import Link from './link'

type Provider = 'github' | 'google'

const GoogleIcon = () => {
  return (
    <svg version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'>
      <path
        fill='#EA4335'
        d='M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z'
      />
      <path
        fill='#4285F4'
        d='M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z'
      />
      <path
        fill='#FBBC05'
        d='M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z'
      />
      <path
        fill='#34A853'
        d='M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z'
      />
      <path fill='none' d='M0 0h48v48H0z' />
    </svg>
  )
}

const SignInDialog = () => {
  const { isSignInDialogOpen, setIsSignInOpen } = useDialogsStore(
    useShallow((state) => ({
      isSignInDialogOpen: state.isSignInDialogOpen,
      setIsSignInOpen: state.setIsSignInOpen
    }))
  )
  const [isPending, setIsPending] = useState(false)
  const [lastUsedProvider, setLastUsedProvider] = useState<Provider | null>(null)
  const t = useTranslations()
  const pathname = usePathname()

  useEffect(() => {
    const provider = localStorage.getItem('last-used-provider') as Provider | null
    // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect -- valid
    setLastUsedProvider(provider)
  }, [])

  const handleSignIn = async (provider: Provider) => {
    localStorage.setItem('last-used-provider', provider)
    await signIn.social({
      provider,
      callbackURL: pathname,
      fetchOptions: {
        onSuccess: () => {
          setIsPending(false)
        },
        onError: () => {
          setIsPending(false)
          toast.error(t('error.sign-in-error'))
        },
        onRequest: () => {
          setIsPending(true)
        }
      }
    })
  }

  const closeDialog = () => {
    if (!isPending) {
      setIsSignInOpen(false)
    }
  }

  return (
    <Dialog
      open={isSignInDialogOpen}
      onOpenChange={(v) => {
        setIsSignInOpen(v)
      }}
    >
      <DialogContent className='sm:max-w-120'>
        <DialogHeader>
          <DialogTitle className='text-left text-2xl'>{t('common.sign-in')}</DialogTitle>
          <DialogDescription className='text-left'>{t('dialog.sign-in.description')}</DialogDescription>
        </DialogHeader>
        <div className='my-6 flex flex-col gap-4'>
          <Button
            className='relative h-10 gap-3 rounded-xl font-semibold'
            onClick={() => handleSignIn('github')}
            disabled={isPending}
            data-testid='github-sign-in-button'
          >
            {isPending ? <LoaderIcon className='animate-spin' /> : <SiGithub />}
            {t('dialog.sign-in.continue-with', { provider: 'GitHub' })}
            {lastUsedProvider === 'github' && <LastUsed />}
          </Button>
          <Button
            className='relative h-10 gap-3 rounded-xl border font-semibold'
            variant='ghost'
            onClick={() => handleSignIn('google')}
            disabled={isPending}
          >
            {isPending ? <LoaderIcon className='animate-spin' /> : <GoogleIcon />}
            {t('dialog.sign-in.continue-with', { provider: 'Google' })}
            {lastUsedProvider === 'google' && <LastUsed />}
          </Button>
        </div>
        <div className='text-center text-xs text-muted-foreground'>
          {t.rich('dialog.sign-in.notice', {
            terms: (chunks) => (
              <Link href='/terms' className='text-foreground underline' onClick={closeDialog}>
                {chunks}
              </Link>
            ),
            privacy: (chunks) => (
              <Link href='/privacy' className='text-foreground underline' onClick={closeDialog}>
                {chunks}
              </Link>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}

const LastUsed = () => {
  const t = useTranslations()

  return (
    <Badge variant='outline' className='absolute -top-2 -right-2 bg-background'>
      {t('dialog.sign-in.last-used')}
    </Badge>
  )
}

export default SignInDialog
