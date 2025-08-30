/**
 * shadcn-table (MIT License)
 * Copyright (c) Sadman Sakib
 * Source:
 *  - https://github.com/sadmann7/shadcn-table/blob/67bfe74c0454c7f657aa22c3d39a4926d6ebaf37/src/lib/data-table.ts
 *  - https://github.com/sadmann7/shadcn-table/blob/67bfe74c0454c7f657aa22c3d39a4926d6ebaf37/src/lib/format.ts
 *  - https://github.com/sadmann7/shadcn-table/blob/67bfe74c0454c7f657aa22c3d39a4926d6ebaf37/src/config/data-table.ts
 *  - https://github.com/sadmann7/shadcn-table/blob/67bfe74c0454c7f657aa22c3d39a4926d6ebaf37/src/lib/parsers.ts
 *
 * Modified by: Nelson Lai
 */
import type { ExtendedColumnSort } from '../components/data-table'
import type { Column } from '@tanstack/react-table'

import { createParser } from 'nuqs/server'
import { z } from 'zod'

type GetCommonPinningStylesOptions<TData> = {
  column: Column<TData>
  withBorder?: boolean
}

export const getCommonPinningStyles = <TData>(options: GetCommonPinningStylesOptions<TData>): React.CSSProperties => {
  const { column, withBorder = false } = options
  const isPinned = column.getIsPinned()
  const isLastLeftPinnedColumn = isPinned === 'left' && column.getIsLastColumn('left')
  const isFirstRightPinnedColumn = isPinned === 'right' && column.getIsFirstColumn('right')

  let boxShadow: React.CSSProperties['boxShadow'] = undefined

  if (withBorder) {
    if (isLastLeftPinnedColumn) {
      boxShadow = '-4px 0 4px -4px hsl(var(--border)) inset'
    } else if (isFirstRightPinnedColumn) {
      boxShadow = '4px 0 4px -4px hsl(var(--border)) inset'
    }
  }

  return {
    boxShadow,
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    opacity: isPinned ? 0.97 : 1,
    position: isPinned ? 'sticky' : 'relative',
    background: 'hsl(var(--background))',
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0
  }
}

export const formatDate = (date: Date | string | number | undefined, opts: Intl.DateTimeFormatOptions = {}) => {
  if (!date) return ''

  try {
    return new Intl.DateTimeFormat('en-US', {
      month: opts.month ?? 'long',
      day: opts.day ?? 'numeric',
      year: opts.year ?? 'numeric',
      ...opts
    }).format(new Date(date))
  } catch {
    return ''
  }
}

export type DataTableConfig = typeof dataTableConfig

export const dataTableConfig = {
  textOperators: [
    { label: 'Contains', value: 'iLike' as const },
    { label: 'Does not contain', value: 'notILike' as const },
    { label: 'Is', value: 'eq' as const },
    { label: 'Is not', value: 'ne' as const },
    { label: 'Is empty', value: 'isEmpty' as const },
    { label: 'Is not empty', value: 'isNotEmpty' as const }
  ],
  numericOperators: [
    { label: 'Is', value: 'eq' as const },
    { label: 'Is not', value: 'ne' as const },
    { label: 'Is less than', value: 'lt' as const },
    { label: 'Is less than or equal to', value: 'lte' as const },
    { label: 'Is greater than', value: 'gt' as const },
    { label: 'Is greater than or equal to', value: 'gte' as const },
    { label: 'Is between', value: 'isBetween' as const },
    { label: 'Is empty', value: 'isEmpty' as const },
    { label: 'Is not empty', value: 'isNotEmpty' as const }
  ],
  dateOperators: [
    { label: 'Is', value: 'eq' as const },
    { label: 'Is not', value: 'ne' as const },
    { label: 'Is before', value: 'lt' as const },
    { label: 'Is after', value: 'gt' as const },
    { label: 'Is on or before', value: 'lte' as const },
    { label: 'Is on or after', value: 'gte' as const },
    { label: 'Is between', value: 'isBetween' as const },
    { label: 'Is relative to today', value: 'isRelativeToToday' as const },
    { label: 'Is empty', value: 'isEmpty' as const },
    { label: 'Is not empty', value: 'isNotEmpty' as const }
  ],
  selectOperators: [
    { label: 'Is', value: 'eq' as const },
    { label: 'Is not', value: 'ne' as const },
    { label: 'Is empty', value: 'isEmpty' as const },
    { label: 'Is not empty', value: 'isNotEmpty' as const }
  ],
  multiSelectOperators: [
    { label: 'Has any of', value: 'inArray' as const },
    { label: 'Has none of', value: 'notInArray' as const },
    { label: 'Is empty', value: 'isEmpty' as const },
    { label: 'Is not empty', value: 'isNotEmpty' as const }
  ],
  booleanOperators: [
    { label: 'Is', value: 'eq' as const },
    { label: 'Is not', value: 'ne' as const }
  ],
  sortOrders: [
    { label: 'Asc', value: 'asc' as const },
    { label: 'Desc', value: 'desc' as const }
  ],
  filterVariants: ['text', 'number', 'range', 'date', 'dateRange', 'boolean', 'select', 'multiSelect'] as const,
  operators: [
    'iLike',
    'notILike',
    'eq',
    'ne',
    'inArray',
    'notInArray',
    'isEmpty',
    'isNotEmpty',
    'lt',
    'lte',
    'gt',
    'gte',
    'isBetween',
    'isRelativeToToday'
  ] as const,
  joinOperators: ['and', 'or'] as const
}

const sortingItemSchema = z.object({
  id: z.string(),
  desc: z.boolean()
})

export const getSortingStateParser = <TData>(columnIds?: string[] | Set<string>) => {
  let validKeys: Set<string> | null = null

  if (columnIds) {
    validKeys = columnIds instanceof Set ? columnIds : new Set(columnIds)
  }

  return createParser({
    parse: (value) => {
      try {
        const parsed = JSON.parse(value)
        const result = z.array(sortingItemSchema).safeParse(parsed)

        if (!result.success) return null

        if (validKeys && result.data.some((item) => !validKeys.has(item.id))) {
          return null
        }

        return result.data as Array<ExtendedColumnSort<TData>>
      } catch {
        return null
      }
    },
    serialize: (value) => JSON.stringify(value),
    eq: (a, b) =>
      a.length === b.length && a.every((item, index) => item.id === b[index]?.id && item.desc === b[index].desc)
  })
}
