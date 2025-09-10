import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { cn } from '@repo/utils'

type TooltipProviderProps = React.ComponentProps<typeof TooltipPrimitive.Provider>

const TooltipProvider = (props: TooltipProviderProps) => {
  const { delayDuration = 0, ...rest } = props

  return (
    // eslint-disable-next-line @eslint-react/no-context-provider -- Custom component
    <TooltipPrimitive.Provider data-slot='tooltip-provider' delayDuration={delayDuration} {...rest} />
  )
}

type TooltipProps = React.ComponentProps<typeof TooltipPrimitive.Root>

const Tooltip = (props: TooltipProps) => (
  <TooltipProvider>
    <TooltipPrimitive.Root data-slot='tooltip' {...props} />
  </TooltipProvider>
)

type TooltipTriggerProps = React.ComponentProps<typeof TooltipPrimitive.Trigger>

const TooltipTrigger = (props: TooltipTriggerProps) => (
  <TooltipPrimitive.Trigger data-slot='tooltip-trigger' {...props} />
)

type TooltipContentProps = React.ComponentProps<typeof TooltipPrimitive.Content>

const TooltipContent = (props: TooltipContentProps) => {
  const { className, sideOffset = 0, children, ...rest } = props

  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot='tooltip-content'
        sideOffset={sideOffset}
        className={cn(
          'z-50 w-fit origin-(--radix-tooltip-content-transform-origin) animate-in rounded-md bg-primary px-3 py-1.5 text-xs text-balance text-primary-foreground fade-in-0 zoom-in-95',
          'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
          'data-[side=top]:slide-in-from-bottom-2',
          'data-[side=right]:slide-in-from-left-2',
          'data-[side=bottom]:slide-in-from-top-2',
          'data-[side=left]:slide-in-from-right-2',
          className
        )}
        {...rest}
      >
        {children}
        <TooltipPrimitive.Arrow className='z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px] bg-primary fill-primary' />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger }
