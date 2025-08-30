/**
 * shadcn-table (MIT License)
 * Copyright (c) Sadman Sakib
 * Source: https://github.com/sadmann7/shadcn-table/blob/67bfe74c0454c7f657aa22c3d39a4926d6ebaf37/src/components/data-table/data-table-date-filter.tsx
 *
 * Modified by: Nelson Lai
 */
import type { Column } from '@tanstack/react-table'
import type { DateRange } from 'react-day-picker'

import { CalendarIcon, XCircleIcon } from 'lucide-react'
import { useCallback, useMemo } from 'react'

import { formatDate } from '../lib/data-table'

import { Button } from './button'
import { Calendar } from './calendar'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { Separator } from './separator'

type DateTableDateFilterProps<TData> = {
  column: Column<TData>
  title?: string
  multiple?: boolean
}

const parseColumnFilterValue = (value: unknown): Array<string | number | undefined> => {
  let array: unknown[]

  if (value == null) {
    array = []
  } else if (Array.isArray(value)) {
    array = value
  } else {
    array = [value]
  }

  return array.map((item) => (typeof item === 'number' || typeof item === 'string' ? item : undefined))
}

const parseAsDate = (timestamp: number | string | undefined): Date | undefined => {
  if (timestamp === undefined) return undefined
  const numericTimestamp = typeof timestamp === 'string' ? Number(timestamp) : timestamp
  const date = new Date(numericTimestamp)
  return Number.isNaN(date.getTime()) ? undefined : date
}

const DataTableDateFilter = <TData,>(props: DateTableDateFilterProps<TData>) => {
  const { column, title, multiple } = props
  const columnFilterValue = column.getFilterValue()

  const selectedDates = useMemo<DateRange>(() => {
    if (!columnFilterValue) {
      return { from: undefined, to: undefined }
    }

    const timestamps = parseColumnFilterValue(columnFilterValue)

    if (multiple) {
      return {
        from: parseAsDate(timestamps[0]),
        to: parseAsDate(timestamps[1])
      }
    }

    const date = parseAsDate(timestamps[0])

    return {
      from: date,
      to: undefined
    }
  }, [columnFilterValue, multiple])

  const onSelect = useCallback(
    (date?: DateRange | Date) => {
      if (!date) {
        column.setFilterValue(undefined)
        return
      }
      if (multiple) {
        const range = date as DateRange
        const from = range.from?.getTime()
        const to = range.to?.getTime()
        column.setFilterValue(from == null && to == null ? undefined : [from, to])
      } else {
        column.setFilterValue((date as Date).getTime())
      }
    },
    [column, multiple]
  )

  const onReset = useCallback(() => {
    column.setFilterValue(undefined)
  }, [column])

  const hasValue = useMemo(() => {
    return multiple ? !!(selectedDates.from ?? selectedDates.to) : !!selectedDates.from
  }, [multiple, selectedDates])

  const label = useMemo(() => {
    if (multiple) {
      const { from, to } = selectedDates
      if (from && to) {
        return (
          <span className='flex items-center gap-2'>
            <span>{title}</span>
            <Separator orientation='vertical' className='mx-0.5 h-4' />
            <span>{`${formatDate(from)} - ${formatDate(to)}`}</span>
          </span>
        )
      }
      if (from || to) {
        const date = from ?? to
        return (
          <span className='flex items-center gap-2'>
            <span>{title}</span>
            <Separator orientation='vertical' className='mx-0.5 h-4' />
            <span>{formatDate(date)}</span>
          </span>
        )
      }
      return <span>{title}</span>
    } else {
      const { from } = selectedDates
      if (from) {
        return (
          <span className='flex items-center gap-2'>
            <span>{title}</span>
            <Separator orientation='vertical' className='mx-0.5 h-4' />
            <span>{formatDate(from)}</span>
          </span>
        )
      }
      return <span>{title}</span>
    }
  }, [selectedDates, multiple, title])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline' size='sm' className='border-dashed'>
          {hasValue ? (
            <div
              role='button'
              aria-label={`Clear ${title} filter`}
              tabIndex={0}
              onClick={onReset}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onReset()
                }
              }}
              className='focus-visible:ring-ring rounded-sm opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-1'
            >
              <XCircleIcon />
            </div>
          ) : (
            <CalendarIcon />
          )}
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        {multiple ? (
          <Calendar initialFocus mode='range' selected={selectedDates} onSelect={onSelect} />
        ) : (
          <Calendar initialFocus mode='single' selected={selectedDates.from} onSelect={onSelect} />
        )}
      </PopoverContent>
    </Popover>
  )
}

export { DataTableDateFilter }
