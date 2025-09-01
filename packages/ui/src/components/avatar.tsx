import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { cn } from '@repo/utils'

type AvatarProps = React.ComponentProps<typeof AvatarPrimitive.Root>

const Avatar = (props: AvatarProps) => {
  const { className, ...rest } = props

  return (
    <AvatarPrimitive.Root
      data-slot='avatar'
      className={cn('relative flex size-8 shrink-0 overflow-hidden rounded-full', className)}
      {...rest}
    />
  )
}

type AvatarImageProps = React.ComponentProps<typeof AvatarPrimitive.Image>

const AvatarImage = (props: AvatarImageProps) => {
  const { className, ...rest } = props

  return (
    <AvatarPrimitive.Image data-slot='avatar-image' className={cn('aspect-square size-full', className)} {...rest} />
  )
}

type AvatarFallbackProps = React.ComponentProps<typeof AvatarPrimitive.Fallback>

const AvatarFallback = (props: AvatarFallbackProps) => {
  const { className, ...rest } = props

  return (
    <AvatarPrimitive.Fallback
      data-slot='avatar-fallback'
      className={cn('flex size-full items-center justify-center rounded-full bg-muted', className)}
      {...rest}
    />
  )
}

export { Avatar, AvatarFallback, AvatarImage }
