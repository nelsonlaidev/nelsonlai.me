'use client'

import { useTranslations } from '@repo/i18n/client'
import { Logo } from '@repo/ui/components/logo'
import { cn } from '@repo/utils'
import { motion } from 'motion/react'
import { useEffect, useState } from 'react'

import CommandMenu from '@/components/command-menu'

import Link from '../link'

import LocaleSwitcher from './locale-switcher'
import MobileNav from './mobile-nav'
import Navbar from './navbar'
import ThemeSwitcher from './theme-switcher'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const t = useTranslations()

  useEffect(() => {
    const changeBackground = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    document.addEventListener('scroll', changeBackground)

    return () => {
      document.removeEventListener('scroll', changeBackground)
    }
  }, [])

  return (
    <motion.header
      className={cn(
        'fixed inset-x-0 top-4 z-40 mx-auto flex h-[60px] max-w-5xl items-center justify-between rounded-2xl bg-background/30 px-8 shadow-xs saturate-100 backdrop-blur-[10px] transition-colors',
        isScrolled && 'bg-background/80'
      )}
      initial={{
        y: -100
      }}
      animate={{
        y: 0
      }}
      transition={{
        duration: 0.3
      }}
    >
      <Link
        href='#skip-nav'
        className='fixed top-4 left-4 -translate-y-20 rounded-xs border bg-background p-2 font-medium shadow-xs transition-transform focus-visible:translate-y-0 focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2'
      >
        <span>{t('layout.skip-to-main-content')}</span>
      </Link>
      <Link href='/' className='flex items-center justify-center gap-1' aria-label={t('layout.home')}>
        <Logo width={20} aria-hidden='true' />
      </Link>
      <div className='flex items-center gap-2'>
        <Navbar />
        <ThemeSwitcher />
        <LocaleSwitcher />
        <CommandMenu />
        <MobileNav />
      </div>
    </motion.header>
  )
}

export default Header
