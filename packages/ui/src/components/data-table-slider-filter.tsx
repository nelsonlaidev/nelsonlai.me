/**
 * shadcn-table (MIT License)
 * Copyright (c) Sadman Sakib
 * Source: https://github.com/sadmann7/shadcn-table/blob/67bfe74c0454c7f657aa22c3d39a4926d6ebaf37/src/components/data-table/data-table-slider-filter.tsx
 *
 * Modified by: Nelson Lai
 */
import type { Column } from '@tanstack/react-table'

import { cn } from '@repo/utils'
import { PlusCircleIcon, XCircleIcon } from 'lucide-react'
import { useCallback, useId, useMemo } from 'react'

import { Button } from './button'
import { Input } from './input'
import { Label } from './label'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { Separator } from './separator'
import { Slider } from './slider'

type Range = {
  min: number
  max: number
}
type RangeValue = [number, number]

const getIsValidRange = (value: unknown): value is RangeValue => {
  return Array.isArray(value) && value.length === 2 && typeof value[0] === 'number' && typeof value[1] === 'number'
}

type DataTableSliderFilterProps<TData> = {
  column: Column<TData>
  title?: string
}

const DataTableSliderFilter = <TData,>(props: DataTableSliderFilterProps<TData>) => {
  const { column, title } = props

  const id = useId()

  const columnFilterValue = getIsValidRange(column.getFilterValue())
    ? (column.getFilterValue() as RangeValue)
    : undefined

  const defaultRange = column.columnDef.meta?.range
  const unit = column.columnDef.meta?.unit

  const { min, max, step } = useMemo<Range & { step: number }>(() => {
    let minValue = 0
    let maxValue = 100
    let stepValue: number

    if (defaultRange && getIsValidRange(defaultRange)) {
      ;[minValue, maxValue] = defaultRange
    } else {
      const values = column.getFacetedMinMaxValues()
      if (values && Array.isArray(values)) {
        const [facetMinValue, facetMaxValue] = values
        if (typeof facetMinValue === 'number' && typeof facetMaxValue === 'number') {
          minValue = facetMinValue
          maxValue = facetMaxValue
        }
      }
    }

    const rangeSize = maxValue - minValue

    if (rangeSize <= 20) {
      stepValue = 1
    } else if (rangeSize <= 100) {
      stepValue = Math.ceil(rangeSize / 20)
    } else {
      stepValue = Math.ceil(rangeSize / 50)
    }

    return { min: minValue, max: maxValue, step: stepValue }
  }, [column, defaultRange])

  const range = useMemo((): RangeValue => {
    return columnFilterValue ?? [min, max]
  }, [columnFilterValue, min, max])

  const formatValue = (value: number) => value.toLocaleString(undefined, { maximumFractionDigits: 0 })

  const onFromInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const numValue = Number(event.target.value)
      if (!Number.isNaN(numValue) && numValue >= min && numValue <= range[1]) {
        column.setFilterValue([numValue, range[1]])
      }
    },
    [column, min, range]
  )

  const onToInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const numValue = Number(event.target.value)
      if (!Number.isNaN(numValue) && numValue <= max && numValue >= range[0]) {
        column.setFilterValue([range[0], numValue])
      }
    },
    [column, max, range]
  )

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>, type: 'from' | 'to') => {
      if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault()
        const currentValue = type === 'from' ? range[0] : range[1]
        const upperBound = type === 'from' ? range[1] : max
        const lowerBound = type === 'from' ? min : range[0]
        const newValue =
          event.key === 'ArrowUp'
            ? Math.min(currentValue + step, upperBound)
            : Math.max(currentValue - step, lowerBound)

        if (type === 'from') {
          column.setFilterValue([newValue, range[1]])
        } else {
          column.setFilterValue([range[0], newValue])
        }
      }
    },
    [column, max, min, range, step]
  )

  const onSliderValueChange = useCallback(
    (value: RangeValue) => {
      if (Array.isArray(value)) {
        column.setFilterValue(value)
      }
    },
    [column]
  )

  const onReset = useCallback(
    (
      event:
        | React.KeyboardEvent<HTMLDivElement | HTMLButtonElement>
        | React.MouseEvent<HTMLDivElement | HTMLButtonElement>
    ) => {
      if (event.target instanceof HTMLDivElement) {
        event.stopPropagation()
      }
      column.setFilterValue(undefined)
    },
    [column]
  )

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline' size='sm' className='border-dashed'>
          {columnFilterValue ? (
            <div
              role='button'
              aria-label={`Clear ${title} filter`}
              tabIndex={0}
              className='focus-visible:ring-ring rounded-sm opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-1'
              onClick={onReset}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onReset(e)
                }
              }}
            >
              <XCircleIcon />
            </div>
          ) : (
            <PlusCircleIcon />
          )}
          <span>{title}</span>
          {columnFilterValue ? (
            <>
              <Separator orientation='vertical' className='mx-0.5 data-[orientation=vertical]:h-4' />
              {formatValue(columnFilterValue[0])} - {formatValue(columnFilterValue[1])}
              {unit ? ` ${unit}` : ''}
            </>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent align='start' className='flex w-auto flex-col gap-4'>
        <div className='flex flex-col gap-3'>
          <p className='font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>{title}</p>
          <div className='flex items-center gap-4'>
            <Label htmlFor={`${id}-from`} className='sr-only'>
              From
            </Label>
            <div className='relative'>
              <Input
                role='spinbutton'
                id={`${id}-from`}
                type='number'
                inputMode='numeric'
                pattern='[0-9]*'
                placeholder={min.toString()}
                min={min}
                max={max}
                value={range[0].toString()}
                onChange={onFromInputChange}
                onKeyDown={(e) => handleKeyDown(e, 'from')}
                className={cn('h-8 w-24', unit && 'pr-8')}
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuenow={range[0]}
                aria-valuetext={`${range[0]}${unit ?? ''}`}
              />
              {unit && (
                <span className='bg-accent text-muted-foreground absolute bottom-0 right-0 top-0 flex items-center rounded-r-md px-2 text-sm'>
                  {unit}
                </span>
              )}
            </div>
            <Label htmlFor={`${id}-to`} className='sr-only'>
              to
            </Label>
            <div className='relative'>
              <Input
                role='spinbutton'
                id={`${id}-to`}
                type='number'
                inputMode='numeric'
                pattern='[0-9]*'
                placeholder={max.toString()}
                min={min}
                max={max}
                value={range[1].toString()}
                onChange={onToInputChange}
                onKeyDown={(e) => handleKeyDown(e, 'to')}
                className={cn('h-8 w-24', unit && 'pr-8')}
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuenow={range[1]}
                aria-valuetext={`${range[1]}${unit ?? ''}`}
              />
              {unit && (
                <span className='bg-accent text-muted-foreground absolute bottom-0 right-0 top-0 flex items-center rounded-r-md px-2 text-sm'>
                  {unit}
                </span>
              )}
            </div>
          </div>
          <Label htmlFor={`${id}-slider`} className='sr-only'>
            {title} slider
          </Label>
          <Slider
            id={`${id}-slider`}
            min={min}
            max={max}
            step={step}
            value={range}
            onValueChange={onSliderValueChange}
          />
        </div>
        <Button aria-label={`Clear ${title} filter`} variant='outline' size='sm' onClick={onReset}>
          Clear
        </Button>
      </PopoverContent>
    </Popover>
  )
}

export { DataTableSliderFilter }
