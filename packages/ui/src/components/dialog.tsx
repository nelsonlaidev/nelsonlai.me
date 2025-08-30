import * as DialogPrimitive from '@radix-ui/react-dialog'
import { cn } from '@repo/utils'
import { XIcon } from 'lucide-react'

type DialogProps = React.ComponentProps<typeof DialogPrimitive.Root>

const Dialog = (props: DialogProps) => <DialogPrimitive.Root data-slot='dialog' {...props} />

type DialogTriggerProps = React.ComponentProps<typeof DialogPrimitive.Trigger>

const DialogTrigger = (props: DialogTriggerProps) => <DialogPrimitive.Trigger data-slot='dialog-trigger' {...props} />

type DialogPortalProps = React.ComponentProps<typeof DialogPrimitive.Portal>

const DialogPortal = (props: DialogPortalProps) => <DialogPrimitive.Portal data-slot='dialog-portal' {...props} />

type DialogCloseProps = React.ComponentProps<typeof DialogPrimitive.Close>

const DialogClose = (props: DialogCloseProps) => <DialogPrimitive.Close data-slot='dialog-close' {...props} />

type DialogOverlayProps = React.ComponentProps<typeof DialogPrimitive.Overlay>

const DialogOverlay = (props: DialogOverlayProps) => {
  const { className, ...rest } = props

  return (
    <DialogPrimitive.Overlay
      data-slot='dialog-overlay'
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

type DialogContentProps = React.ComponentProps<typeof DialogPrimitive.Content>

const DialogContent = (props: DialogContentProps) => {
  const { className, children, ...rest } = props

  return (
    <DialogPortal data-slot='dialog-portal'>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot='dialog-content'
        className={cn(
          'fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-1/2 gap-4 rounded-lg border bg-background p-6 shadow-lg duration-200',
          'sm:max-w-lg',
          'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
          'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
          className
        )}
        {...rest}
      >
        {children}
        <DialogPrimitive.Close
          className={cn(
            'absolute top-4 right-4 rounded-xs opacity-70 ring-offset-background transition-opacity',
            'hover:opacity-100',
            'focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden',
            'disabled:pointer-events-none',
            'data-[state=open]:bg-accent data-[state=open]:text-muted-foreground',
            '[&_svg]:pointer-events-none [&_svg]:shrink-0',
            "[&_svg:not([class*='size-'])]:size-4"
          )}
        >
          <XIcon />
          <span className='sr-only'>Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

type DialogHeaderProps = React.ComponentProps<'div'>

const DialogHeader = (props: DialogHeaderProps) => {
  const { className, ...rest } = props

  return (
    <div
      data-slot='dialog-header'
      className={cn('flex flex-col gap-2 text-center sm:text-left', className)}
      {...rest}
    />
  )
}

type DialogFooterProps = React.ComponentProps<'div'>

const DialogFooter = (props: DialogFooterProps) => {
  const { className, ...rest } = props

  return (
    <div
      data-slot='dialog-footer'
      className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
      {...rest}
    />
  )
}

type DialogTitleProps = React.ComponentProps<typeof DialogPrimitive.Title>

const DialogTitle = (props: DialogTitleProps) => {
  const { className, ...rest } = props

  return (
    <DialogPrimitive.Title
      data-slot='dialog-title'
      className={cn('text-lg leading-none font-semibold', className)}
      {...rest}
    />
  )
}

type DialogDescriptionProps = React.ComponentProps<typeof DialogPrimitive.Description>

const DialogDescription = (props: DialogDescriptionProps) => {
  const { className, ...rest } = props

  return (
    <DialogPrimitive.Description
      data-slot='dialog-description'
      className={cn('text-sm text-muted-foreground', className)}
      {...rest}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger
}
