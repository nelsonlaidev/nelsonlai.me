import { SegmentGroup as SegmentGroupPrimitive } from '@ark-ui/react/segment-group'
import { cn } from '@repo/utils'

type SegmentGroupProps = React.ComponentProps<typeof SegmentGroupPrimitive.Root>

const SegmentGroup = (props: SegmentGroupProps) => {
  const { className, children, orientation, ...rest } = props

  return (
    <SegmentGroupPrimitive.Root
      data-slot='segment-group'
      orientation={orientation}
      className={cn(
        'flex items-start',
        orientation === 'horizontal' ? 'gap-4 border-b' : 'flex-col gap-1 border-l',
        className
      )}
      {...rest}
    >
      <SegmentGroupPrimitive.Indicator
        data-slot='segment-group-indicator'
        className={cn(
          'border-foreground',
          'data-[orientation=horizontal]:bottom-0 data-[orientation=horizontal]:w-(--width) data-[orientation=horizontal]:translate-y-px data-[orientation=horizontal]:border-b-2',
          'data-[orientation=vertical]:h-(--height) data-[orientation=vertical]:-translate-x-px data-[orientation=vertical]:border-l-2',
          className
        )}
      />
      {children}
    </SegmentGroupPrimitive.Root>
  )
}

type SegmentGroupItemProps = React.ComponentProps<typeof SegmentGroupPrimitive.Item>

const SegmentGroupItem = (props: SegmentGroupItemProps) => {
  const { className, children, ...rest } = props

  return (
    <SegmentGroupPrimitive.Item
      data-slot='segment-group-item'
      className={cn(
        'cursor-pointer font-medium text-muted-foreground transition-colors',
        'hover:text-accent-foreground',
        'data-[state=checked]:text-foreground',
        'data-[orientation=horizontal]:px-1 data-[orientation=horizontal]:pb-3',
        'data-[orientation=vertical]:px-3 data-[orientation=vertical]:py-1.5',
        'data-disabled:cursor-not-allowed data-disabled:text-muted-foreground data-disabled:opacity-50',
        className
      )}
      {...rest}
    >
      <SegmentGroupPrimitive.ItemText>{children}</SegmentGroupPrimitive.ItemText>
      <SegmentGroupPrimitive.ItemControl />
      <SegmentGroupPrimitive.ItemHiddenInput />
    </SegmentGroupPrimitive.Item>
  )
}

export { SegmentGroup, SegmentGroupItem }
