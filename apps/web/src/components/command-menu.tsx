'use client'

import { SiFacebook, SiGithub, SiInstagram, SiX, SiYoutube } from '@icons-pack/react-simple-icons'
import { useTranslations } from '@repo/i18n/client'
import { useRouter } from '@repo/i18n/routing'
import { Button } from '@repo/ui/components/button'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@repo/ui/components/command'
import { CodeIcon, CommandIcon, LinkIcon, LogInIcon, LogOutIcon } from 'lucide-react'
import { Fragment, useCallback, useEffect, useState } from 'react'

import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { signOut, useSession } from '@/lib/auth-client'
import {
  SITE_FACEBOOK_URL,
  SITE_GITHUB_URL,
  SITE_INSTAGRAM_URL,
  SITE_X_URL,
  SITE_YOUTUBE_URL
} from '@/lib/constants'
import { useDialogsStore } from '@/stores/dialogs.store'

type Groups = Array<{
  name: string
  actions: Array<{
    title: string
    icon: React.ReactNode
    onSelect: () => void | Promise<void>
  }>
}>

const CommandMenu = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [copy] = useCopyToClipboard()
  const { data: session } = useSession()
  const t = useTranslations()
  const setIsSignInOpen = useDialogsStore((state) => state.setIsSignInOpen)
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsOpen((value) => !value)
      }
    }

    document.addEventListener('keydown', down)

    return () => document.removeEventListener('keydown', down)
  }, [])

  const openLink = useCallback((url: string) => {
    setIsOpen(false)
    window.open(url, '_blank', 'noopener')
  }, [])

  const groups: Groups = [
    {
      name: t('command-menu.groups.account'),
      actions: [
        ...(session
          ? [
              {
                title: t('common.sign-out'),
                icon: <LogOutIcon />,
                onSelect: async () => {
                  await signOut({
                    fetchOptions: {
                      onSuccess: () => {
                        router.refresh()
                      }
                    }
                  })
                }
              }
            ]
          : [
              {
                title: t('common.sign-in'),
                icon: <LogInIcon />,
                onSelect: () => {
                  setIsOpen(false)
                  setIsSignInOpen(true)
                }
              }
            ])
      ]
    },
    {
      name: t('command-menu.groups.general'),
      actions: [
        {
          title: t('command-menu.actions.copy-link'),
          icon: <LinkIcon />,
          onSelect: async () => {
            setIsOpen(false)

            await copy({ text: globalThis.location.href })
          }
        },
        {
          title: t('command-menu.actions.source-code'),
          icon: <CodeIcon />,
          onSelect: () => openLink('https://github.com/tszhong0411/nelsonlai.me')
        }
      ]
    },
    {
      name: t('command-menu.groups.social'),
      actions: [
        {
          title: 'GitHub',
          icon: <SiGithub />,
          onSelect: () => openLink(SITE_GITHUB_URL)
        },
        {
          title: 'Facebook',
          icon: <SiFacebook />,
          onSelect: () => openLink(SITE_FACEBOOK_URL)
        },
        {
          title: 'Instagram',
          icon: <SiInstagram />,
          onSelect: () => openLink(SITE_INSTAGRAM_URL)
        },
        {
          title: 'X',
          icon: <SiX />,
          onSelect: () => openLink(SITE_X_URL)
        },
        {
          title: 'YouTube',
          icon: <SiYoutube />,
          onSelect: () => openLink(SITE_YOUTUBE_URL)
        }
      ]
    }
  ]

  return (
    <>
      <Button
        variant='ghost'
        className='size-9 p-0'
        onClick={() => setIsOpen(true)}
        aria-label={t('command-menu.open-menu')}
        data-testid='command-menu-button'
      >
        <CommandIcon />
      </Button>
      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <CommandInput placeholder={t('command-menu.placeholder')} />
        <CommandList>
          <CommandEmpty>{t('command-menu.no-results')}</CommandEmpty>
          {groups.map((group, i) => (
            <Fragment key={group.name}>
              <CommandGroup heading={group.name}>
                {group.actions.map((action) => (
                  <CommandItem key={action.title} onSelect={action.onSelect}>
                    {action.icon}
                    {action.title}
                  </CommandItem>
                ))}
              </CommandGroup>
              {i === groups.length - 1 ? null : <CommandSeparator />}
            </Fragment>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  )
}

export default CommandMenu
