import * as SliderPrimitive from '@radix-ui/react-slider'
import { cn, range } from '@repo/utils'
import { useMemo } from 'react'

type SliderProps = React.ComponentProps<typeof SliderPrimitive.Root>

const Slider = (props: SliderProps) => {
  const { className, defaultValue, value, min = 0, max = 100, ...rest } = props

  const getInitialValues = () => {
    if (Array.isArray(value)) {
      return value
    }
    if (Array.isArray(defaultValue)) {
      return defaultValue
    }
    return [min, max]
  }

  const _values = useMemo(getInitialValues, [value, defaultValue, min, max])

  return (
    <SliderPrimitive.Root
      data-slot='slider'
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        'relative flex w-full touch-none items-center select-none',
        'data-[disabled]:opacity-50',
        'data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col',
        className
      )}
      {...rest}
    >
      <SliderPrimitive.Track
        data-slot='slider-track'
        className={cn(
          'relative grow overflow-hidden rounded-full bg-muted',
          'data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full',
          'data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5'
        )}
      >
        <SliderPrimitive.Range
          data-slot='slider-range'
          className={cn(
            'absolute bg-primary',
            'data-[orientation=horizontal]:h-full',
            'data-[orientation=vertical]:w-full'
          )}
        />
      </SliderPrimitive.Track>
      {range(_values.length).map((i) => (
        <SliderPrimitive.Thumb
          data-slot='slider-thumb'
          key={i}
          className={cn(
            'block size-4 shrink-0 rounded-full border border-primary bg-background shadow-sm ring-ring/50 transition-[color,box-shadow]',
            'hover:ring-4',
            'focus-visible:ring-4 focus-visible:outline-hidden',
            'disabled:pointer-events-none disabled:opacity-50'
          )}
        />
      ))}
    </SliderPrimitive.Root>
  )
}

export { Slider }
