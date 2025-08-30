import { useTranslations } from '@repo/i18n/client'
import { i18n, supportedLanguages } from '@repo/i18n/config'
import { usePathname, useRouter } from '@repo/i18n/routing'
import { Button } from '@repo/ui/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@repo/ui/components/dropdown-menu'
import { LanguagesIcon } from 'lucide-react'
import { useTransition } from 'react'

const LocaleSwitcher = () => {
  const t = useTranslations()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild={true}>
        <Button variant='ghost' className='size-9 p-0' aria-label={t('layout.change-language')}>
          <LanguagesIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {i18n.locales.map((locale) => (
          <Item key={locale} locale={locale} />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

type ItemProps = {
  locale: string
}

const Item = (props: ItemProps) => {
  const { locale } = props
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const pathname = usePathname()

  const switchLanguage = () => {
    startTransition(() => {
      router.replace(pathname, { locale })
    })
  }

  return (
    <DropdownMenuItem key={locale} disabled={isPending} onClick={switchLanguage}>
      {supportedLanguages.find((l) => l.code === locale)?.label}
    </DropdownMenuItem>
  )
}

export default LocaleSwitcher
