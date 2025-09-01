import { useTranslations } from '@repo/i18n/client'
import { Button } from '@repo/ui/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@repo/ui/components/dropdown-menu'
import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'

const ThemeSwitcher = () => {
  const { setTheme } = useTheme()
  const t = useTranslations()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='size-9 p-0'
          aria-label={t('theme-toggle.toggle-theme')}
          data-testid='theme-toggle'
        >
          <SunIcon className='dark:hidden' />
          <MoonIcon className='hidden dark:block' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem
          className='gap-2'
          onClick={() => {
            setTheme('light')
          }}
          data-testid='theme-light-button'
        >
          <SunIcon className='size-[18px]' /> {t('theme-toggle.options.light')}
        </DropdownMenuItem>
        <DropdownMenuItem
          className='gap-2'
          onClick={() => {
            setTheme('dark')
          }}
          data-testid='theme-dark-button'
        >
          <MoonIcon className='size-[18px]' /> {t('theme-toggle.options.dark')}
        </DropdownMenuItem>
        <DropdownMenuItem
          className='gap-2'
          onClick={() => {
            setTheme('system')
          }}
          data-testid='theme-system-button'
        >
          <MonitorIcon className='size-[18px]' /> {t('theme-toggle.options.system')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ThemeSwitcher
