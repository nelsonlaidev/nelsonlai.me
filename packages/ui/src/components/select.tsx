import * as SelectPrimitive from '@radix-ui/react-select'
import { cn } from '@repo/utils'
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react'

type SelectProps = React.ComponentProps<typeof SelectPrimitive.Root>

const Select = (props: SelectProps) => <SelectPrimitive.Root data-slot='select' {...props} />

type SelectGroupProps = React.ComponentProps<typeof SelectPrimitive.Group>

const SelectGroup = (props: SelectGroupProps) => <SelectPrimitive.Group data-slot='select-group' {...props} />

type SelectValueProps = React.ComponentProps<typeof SelectPrimitive.Value>

const SelectValue = (props: SelectValueProps) => <SelectPrimitive.Value data-slot='select-value' {...props} />

type SelectTriggerProps = React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: 'sm' | 'default'
}

const SelectTrigger = (props: SelectTriggerProps) => {
  const { className, size = 'default', children, ...rest } = props

  return (
    <SelectPrimitive.Trigger
      data-slot='select-trigger'
      data-size={size}
      className={cn(
        'border-input shadow-xs flex w-fit items-center justify-between gap-2 whitespace-nowrap rounded-md border bg-transparent px-3 py-2 text-sm outline-none transition-[color,box-shadow]',
        'dark:aria-invalid:ring-destructive/40 dark:bg-input/30 dark:hover:bg-input/50',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-destructive/20 aria-invalid:border-destructive',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'data-[placeholder]:text-muted-foreground',
        'data-[size=default]:h-9',
        'data-[size=sm]:h-8',
        '*:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2',
        '[&_svg]:pointer-events-none [&_svg]:shrink-0',
        "[&_svg:not([class*='text-'])]:text-muted-foreground",
        "[&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...rest}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className='opacity-50' />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

type SelectContentProps = React.ComponentProps<typeof SelectPrimitive.Content>

const SelectContent = (props: SelectContentProps) => {
  const { className, children, position = 'popper', ...rest } = props

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot='select-content'
        className={cn(
          'bg-popover text-popover-foreground max-h-(--radix-select-content-available-height) origin-(--radix-select-content-transform-origin) relative z-50 min-w-32 overflow-y-auto overflow-x-hidden rounded-md border shadow-md',
          'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
          'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
          'data-[side=top]:slide-in-from-bottom-2',
          'data-[side=right]:slide-in-from-left-2',
          'data-[side=bottom]:slide-in-from-top-2',
          'data-[side=left]:slide-in-from-right-2',
          position === 'popper' &&
            'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
          className
        )}
        position={position}
        {...rest}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            'p-1',
            position === 'popper' &&
              'h-(--radix-select-trigger-height) min-w-(--radix-select-trigger-width) w-full scroll-my-1'
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

type SelectLabelProps = React.ComponentProps<typeof SelectPrimitive.Label>

const SelectLabel = (props: SelectLabelProps) => {
  const { className, ...rest } = props

  return (
    <SelectPrimitive.Label
      data-slot='select-label'
      className={cn('text-muted-foreground px-2 py-1.5 text-xs', className)}
      {...rest}
    />
  )
}

type SelectItemProps = React.ComponentProps<typeof SelectPrimitive.Item>

const SelectItem = (props: SelectItemProps) => {
  const { className, children, ...rest } = props

  return (
    <SelectPrimitive.Item
      data-slot='select-item'
      className={cn(
        'outline-hidden relative flex w-full cursor-default select-none items-center gap-2 rounded-sm py-1.5 pl-2 pr-8 text-sm',
        'focus:bg-accent focus:text-accent-foreground',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        '*:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2',
        '[&_svg]:pointer-events-none [&_svg]:shrink-0',
        "[&_svg:not([class*='text-'])]:text-muted-foreground",
        "[&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...rest}
    >
      <span className='absolute right-2 flex size-3.5 items-center justify-center'>
        <SelectPrimitive.ItemIndicator>
          <CheckIcon />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

type SelectSeparatorProps = React.ComponentProps<typeof SelectPrimitive.Separator>

const SelectSeparator = (props: SelectSeparatorProps) => {
  const { className, ...rest } = props

  return (
    <SelectPrimitive.Separator
      data-slot='select-separator'
      className={cn('bg-border pointer-events-none -mx-1 my-1 h-px', className)}
      {...rest}
    />
  )
}

type SelectScrollUpButtonProps = React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>

const SelectScrollUpButton = (props: SelectScrollUpButtonProps) => {
  const { className, ...rest } = props

  return (
    <SelectPrimitive.ScrollUpButton
      data-slot='select-scroll-up-button'
      className={cn('flex cursor-default items-center justify-center py-1', className)}
      {...rest}
    >
      <ChevronUpIcon className='size-4' />
    </SelectPrimitive.ScrollUpButton>
  )
}

type SelectScrollDownButtonProps = React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>

const SelectScrollDownButton = (props: SelectScrollDownButtonProps) => {
  const { className, ...rest } = props

  return (
    <SelectPrimitive.ScrollDownButton
      data-slot='select-scroll-down-button'
      className={cn('flex cursor-default items-center justify-center py-1', className)}
      {...rest}
    >
      <ChevronDownIcon className='size-4' />
    </SelectPrimitive.ScrollDownButton>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue
}
