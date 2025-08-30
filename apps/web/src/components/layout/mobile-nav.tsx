'use client'

import { useTranslations } from '@repo/i18n/client'
import { Button } from '@repo/ui/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@repo/ui/components/dropdown-menu'
import { MenuIcon } from 'lucide-react'

import { HEADER_LINKS } from '@/config/links'

import Link from '../link'

const MobileNav = () => {
  const t = useTranslations()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild={true}>
        <Button
          className='flex size-9 items-center justify-center p-0 md:hidden'
          aria-label={t('layout.toggle-menu')}
          variant='ghost'
        >
          <MenuIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' sideOffset={20} className='min-w-40'>
        {HEADER_LINKS.map((link) => (
          <DropdownMenuItem key={link.key} asChild={true}>
            <Link href={link.href} className='flex items-center gap-4'>
              {link.icon}
              <div>{t(`layout.${link.key}`)}</div>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default MobileNav
