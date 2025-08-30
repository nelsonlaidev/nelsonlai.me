import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'
import { cn } from '@repo/utils'

import { buttonVariants } from './button'

type AlertDialogProps = React.ComponentProps<typeof AlertDialogPrimitive.Root>

const AlertDialog = (props: AlertDialogProps) => <AlertDialogPrimitive.Root data-slot='alert-dialog' {...props} />

type AlertDialogTriggerProps = React.ComponentProps<typeof AlertDialogPrimitive.Trigger>

const AlertDialogTrigger = (props: AlertDialogTriggerProps) => (
  <AlertDialogPrimitive.Trigger data-slot='alert-dialog-trigger' {...props} />
)

type AlertDialogPortalProps = React.ComponentProps<typeof AlertDialogPrimitive.Portal>

const AlertDialogPortal = (props: AlertDialogPortalProps) => (
  <AlertDialogPrimitive.Portal data-slot='alert-dialog-portal' {...props} />
)

type AlertDialogOverlayProps = React.ComponentProps<typeof AlertDialogPrimitive.Overlay>

const AlertDialogOverlay = (props: AlertDialogOverlayProps) => {
  const { className, ...rest } = props

  return (
    <AlertDialogPrimitive.Overlay
      data-slot='alert-dialog-overlay'
      className={cn(
        'fixed inset-0 z-50 bg-black/50',
        'data-[state=open]:animate-in data-[state=open]:fade-in-0',
        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
        className
      )}
      {...rest}
    />
  )
}

type AlertDialogContentProps = React.ComponentProps<typeof AlertDialogPrimitive.Content>

const AlertDialogContent = (props: AlertDialogContentProps) => {
  const { className, ...rest } = props

  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        data-slot='alert-dialog-content'
        className={cn(
          'fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-1/2 gap-4 rounded-lg border bg-background p-6 shadow-lg duration-200',
          'sm:max-w-lg',
          'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
          'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
          className
        )}
        {...rest}
      />
    </AlertDialogPortal>
  )
}

type AlertDialogHeaderProps = React.ComponentProps<'div'>

const AlertDialogHeader = (props: AlertDialogHeaderProps) => {
  const { className, ...rest } = props

  return (
    <div
      data-slot='alert-dialog-header'
      className={cn('flex flex-col gap-2 text-center sm:text-left', className)}
      {...rest}
    />
  )
}

type AlertDialogFooterProps = React.ComponentProps<'div'>

const AlertDialogFooter = (props: AlertDialogFooterProps) => {
  const { className, ...rest } = props

  return (
    <div
      data-slot='alert-dialog-footer'
      className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
      {...rest}
    />
  )
}

type AlertDialogTitleProps = React.ComponentProps<typeof AlertDialogPrimitive.Title>

const AlertDialogTitle = (props: AlertDialogTitleProps) => {
  const { className, ...rest } = props

  return (
    <AlertDialogPrimitive.Title
      data-slot='alert-dialog-title'
      className={cn('text-lg font-semibold', className)}
      {...rest}
    />
  )
}

type AlertDialogDescriptionProps = React.ComponentProps<typeof AlertDialogPrimitive.Description>

const AlertDialogDescription = (props: AlertDialogDescriptionProps) => {
  const { className, ...rest } = props

  return (
    <AlertDialogPrimitive.Description
      data-slot='alert-dialog-description'
      className={cn('text-sm text-muted-foreground', className)}
      {...rest}
    />
  )
}

type AlertDialogActionProps = React.ComponentProps<typeof AlertDialogPrimitive.Action>

const AlertDialogAction = (props: AlertDialogActionProps) => {
  const { className, ...rest } = props

  return <AlertDialogPrimitive.Action className={cn(buttonVariants(), className)} {...rest} />
}

type AlertDialogCancelProps = React.ComponentProps<typeof AlertDialogPrimitive.Cancel>

const AlertDialogCancel = (props: AlertDialogCancelProps) => {
  const { className, ...rest } = props

  return <AlertDialogPrimitive.Cancel className={cn(buttonVariants({ variant: 'outline' }), className)} {...rest} />
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger
}
