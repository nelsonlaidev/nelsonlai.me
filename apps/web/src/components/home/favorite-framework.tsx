import { SiNextdotjs } from '@icons-pack/react-simple-icons'
import { useTranslations } from '@repo/i18n/client'
import { HeartIcon } from 'lucide-react'

const FavoriteFramework = () => {
  const t = useTranslations()

  return (
    <div className='flex flex-col gap-6 rounded-xl p-4 shadow-feature-card lg:p-6'>
      <div className='flex items-center gap-2'>
        <HeartIcon className='size-[18px]' />
        <h2 className='text-sm'>{t('homepage.about-me.fav-framework')}</h2>
      </div>
      <div className='flex items-center justify-center'>
        <SiNextdotjs size={80} className='text-zinc-800 dark:text-zinc-200' />
      </div>
    </div>
  )
}

export default FavoriteFramework
