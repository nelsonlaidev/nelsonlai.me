import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import { cn } from '@repo/utils'
import { CheckIcon, ChevronRightIcon, CircleIcon } from 'lucide-react'

type DropdownMenuProps = React.ComponentProps<typeof DropdownMenuPrimitive.Root>

const DropdownMenu = (props: DropdownMenuProps) => <DropdownMenuPrimitive.Root data-slot='dropdown-menu' {...props} />

type DropdownMenuPortalProps = React.ComponentProps<typeof DropdownMenuPrimitive.Portal>

const DropdownMenuPortal = (props: DropdownMenuPortalProps) => (
  <DropdownMenuPrimitive.Portal data-slot='dropdown-menu-portal' {...props} />
)

type DropdownMenuTriggerProps = React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>

const DropdownMenuTrigger = (props: DropdownMenuTriggerProps) => (
  <DropdownMenuPrimitive.Trigger data-slot='dropdown-menu-trigger' {...props} />
)

type DropdownMenuContentProps = React.ComponentProps<typeof DropdownMenuPrimitive.Content>

const DropdownMenuContent = (props: DropdownMenuContentProps) => {
  const { className, sideOffset = 4, ...rest } = props

  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot='dropdown-menu-content'
        sideOffset={sideOffset}
        className={cn(
          'bg-popover text-popover-foreground max-h-(--radix-dropdown-menu-content-available-height) origin-(--radix-dropdown-menu-content-transform-origin) z-50 min-w-32 overflow-y-auto overflow-x-hidden rounded-md border p-1 shadow-md',
          'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
          'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
          'data-[side=top]:slide-in-from-bottom-2',
          'data-[side=right]:slide-in-from-left-2',
          'data-[side=bottom]:slide-in-from-top-2',
          'data-[side=left]:slide-in-from-right-2',
          className
        )}
        {...rest}
      />
    </DropdownMenuPrimitive.Portal>
  )
}

type DropdownMenuGroupProps = React.ComponentProps<typeof DropdownMenuPrimitive.Group>

const DropdownMenuGroup = (props: DropdownMenuGroupProps) => (
  <DropdownMenuPrimitive.Group data-slot='dropdown-menu-group' {...props} />
)

type DropdownMenuItemProps = React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean
  variant?: 'default' | 'destructive'
}

const DropdownMenuItem = (props: DropdownMenuItemProps) => {
  const { className, inset, variant = 'default', ...rest } = props

  return (
    <DropdownMenuPrimitive.Item
      data-slot='dropdown-menu-item'
      data-inset={inset}
      data-variant={variant}
      className={cn(
        'outline-hidden relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm',
        'dark:data-[variant=destructive]:focus:bg-destructive/20',
        'focus:bg-accent focus:text-accent-foreground',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        'data-[inset]:pl-8',
        'data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive',
        '[&_svg]:pointer-events-none [&_svg]:shrink-0',
        "[&_svg:not([class*='text-'])]:text-muted-foreground",
        "[&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...rest}
    />
  )
}

type DropdownMenuCheckboxItemProps = React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>

const DropdownMenuCheckboxItem = (props: DropdownMenuCheckboxItemProps) => {
  const { className, children, checked, ...rest } = props

  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot='dropdown-menu-checkbox-item'
      className={cn(
        'outline-hidden relative flex cursor-default select-none items-center gap-2 rounded-sm py-1.5 pl-8 pr-2 text-sm',
        'focus:bg-accent focus:text-accent-foreground',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        '[&_svg]:pointer-events-none [&_svg]:shrink-0',
        "[&_svg:not([class*='size-'])]:size-4",
        className
      )}
      checked={checked}
      {...rest}
    >
      <span className='pointer-events-none absolute left-2 flex size-3.5 items-center justify-center'>
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  )
}

type DropdownMenuRadioGroupProps = React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>

const DropdownMenuRadioGroup = (props: DropdownMenuRadioGroupProps) => (
  <DropdownMenuPrimitive.RadioGroup data-slot='dropdown-menu-radio-group' {...props} />
)

type DropdownMenuRadioItemProps = React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>

const DropdownMenuRadioItem = (props: DropdownMenuRadioItemProps) => {
  const { className, children, ...rest } = props

  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot='dropdown-menu-radio-item'
      className={cn(
        'outline-hidden relative flex cursor-default select-none items-center gap-2 rounded-sm py-1.5 pl-8 pr-2 text-sm',
        'focus:bg-accent focus:text-accent-foreground',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        '[&_svg]:pointer-events-none [&_svg]:shrink-0',
        "[&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...rest}
    >
      <span className='pointer-events-none absolute left-2 flex size-3.5 items-center justify-center'>
        <DropdownMenuPrimitive.ItemIndicator>
          <CircleIcon className='size-2 fill-current' />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  )
}

type DropdownMenuLabelProps = React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  inset?: boolean
}

const DropdownMenuLabel = (props: DropdownMenuLabelProps) => {
  const { className, inset, ...rest } = props

  return (
    <DropdownMenuPrimitive.Label
      data-slot='dropdown-menu-label'
      data-inset={inset}
      className={cn('px-2 py-1.5 text-sm font-medium data-[inset]:pl-8', className)}
      {...rest}
    />
  )
}

type DropdownMenuSeparatorProps = React.ComponentProps<typeof DropdownMenuPrimitive.Separator>

const DropdownMenuSeparator = (props: DropdownMenuSeparatorProps) => {
  const { className, ...rest } = props

  return (
    <DropdownMenuPrimitive.Separator
      data-slot='dropdown-menu-separator'
      className={cn('bg-border -mx-1 my-1 h-px', className)}
      {...rest}
    />
  )
}

type DropdownMenuShortcutProps = React.ComponentProps<'span'>

const DropdownMenuShortcut = (props: DropdownMenuShortcutProps) => {
  const { className, ...rest } = props

  return (
    <span
      data-slot='dropdown-menu-shortcut'
      className={cn('text-muted-foreground ml-auto text-xs tracking-widest', className)}
      {...rest}
    />
  )
}

type DropdownMenuSubProps = React.ComponentProps<typeof DropdownMenuPrimitive.Sub>

const DropdownMenuSub = (props: DropdownMenuSubProps) => (
  <DropdownMenuPrimitive.Sub data-slot='dropdown-menu-sub' {...props} />
)

type DropdownMenuSubTriggerProps = React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
  inset?: boolean
}

const DropdownMenuSubTrigger = (props: DropdownMenuSubTriggerProps) => {
  const { className, inset, children, ...rest } = props

  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot='dropdown-menu-sub-trigger'
      data-inset={inset}
      className={cn(
        'outline-hidden flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm',
        'focus:bg-accent focus:text-accent-foreground',
        'data-[inset]:pl-8',
        'data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
        '[&_svg]:pointer-events-none [&_svg]:shrink-0',
        "[&_svg:not([class*='text-'])]:text-muted-foreground",
        "[&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...rest}
    >
      {children}
      <ChevronRightIcon className='ml-auto' />
    </DropdownMenuPrimitive.SubTrigger>
  )
}

type DropdownMenuSubContentProps = React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>

const DropdownMenuSubContent = (props: DropdownMenuSubContentProps) => {
  const { className, ...rest } = props

  return (
    <DropdownMenuPrimitive.SubContent
      data-slot='dropdown-menu-sub-content'
      className={cn(
        'bg-popover text-popover-foreground origin-(--radix-dropdown-menu-content-transform-origin) z-50 min-w-32 overflow-hidden rounded-md border p-1 shadow-lg',
        'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
        'data-[side=top]:slide-in-from-bottom-2',
        'data-[side=right]:slide-in-from-left-2',
        'data-[side=bottom]:slide-in-from-top-2',
        'data-[side=left]:slide-in-from-right-2',
        className
      )}
      {...rest}
    />
  )
}

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
}
