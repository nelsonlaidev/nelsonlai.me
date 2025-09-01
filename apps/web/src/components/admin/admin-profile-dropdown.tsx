import { useTranslations } from '@repo/i18n/client'
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/avatar'
import { Button } from '@repo/ui/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@repo/ui/components/dropdown-menu'
import { Skeleton } from '@repo/ui/components/skeleton'
import { getAbbreviation } from '@repo/utils'

import { useSession } from '@/lib/auth-client'
import { useDialogsStore } from '@/stores/dialogs.store'
import { getDefaultImage } from '@/utils/get-default-image'

const AdminProfileDropdown = () => {
  const { data: session, isPending } = useSession()
  const t = useTranslations()
  const setIsSignInOpen = useDialogsStore((state) => state.setIsSignInOpen)

  if (isPending) {
    return <Skeleton className='size-9 rounded-full' />
  }

  if (!session) {
    return (
      <Button
        size='sm'
        onClick={() => {
          setIsSignInOpen(true)
        }}
      >
        {t('common.sign-in')}
      </Button>
    )
  }

  const { id, image, name, email } = session.user
  const defaultImage = getDefaultImage(id)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className='size-9 rounded-full' variant='ghost' aria-label={t('layout.profile')}>
          <Avatar className='size-9'>
            <AvatarImage src={image ?? defaultImage} />
            <AvatarFallback>{getAbbreviation(name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end'>
        <DropdownMenuLabel>
          <div className='flex flex-col gap-1'>
            <p className='text-sm'>{name}</p>
            <p className='text-xs text-muted-foreground'>{email}</p>
          </div>
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default AdminProfileDropdown
