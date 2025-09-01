import { useTranslations } from '@repo/i18n/client'
import { LinkIcon } from 'lucide-react'

import { SOCIAL_LINKS } from '@/config/links'

import Link from '../link'

const Connect = () => {
  const t = useTranslations()

  return (
    <div className='flex flex-col gap-6 rounded-xl p-4 shadow-feature-card lg:p-6'>
      <div className='flex items-center gap-2'>
        <LinkIcon className='size-[18px]' />
        <h2 className='text-sm'>{t('homepage.about-me.connect')}</h2>
      </div>
      <div className='flex flex-col gap-4 px-2'>
        {SOCIAL_LINKS.map((link) => {
          const { href, title, icon } = link

          const Icon = icon

          return (
            <Link
              key={href}
              href={href}
              className='flex w-fit items-center gap-3 text-muted-foreground transition-colors hover:text-foreground'
            >
              <Icon className='size-[18px]' />
              <h3>{title}</h3>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default Connect
