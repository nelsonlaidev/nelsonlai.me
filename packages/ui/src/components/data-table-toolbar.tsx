/**
 * shadcn-table (MIT License)
 * Copyright (c) Sadman Sakib
 * Source: https://github.com/sadmann7/shadcn-table/blob/67bfe74c0454c7f657aa22c3d39a4926d6ebaf37/src/components/data-table/data-table-toolbar.tsx
 *
 * Modified by: Nelson Lai
 */
import type { Column, Table } from '@tanstack/react-table'

import { cn } from '@repo/utils'
import { XIcon } from 'lucide-react'
import { useCallback, useMemo } from 'react'

import { Button } from './button'
import { DataTableDateFilter } from './data-table-date-filter'
import { DataTableFacetedFilter } from './data-table-faceted-filter'
import { DataTableSliderFilter } from './data-table-slider-filter'
import { DataTableViewOptions } from './data-table-view-options'
import { Input } from './input'

type DataTableToolbarProps<TData> = {
  table: Table<TData>
} & React.ComponentProps<'div'>

const DataTableToolbar = <TData,>(props: DataTableToolbarProps<TData>) => {
  const { table, children, className, ...rest } = props

  const isFiltered = table.getState().columnFilters.length > 0

  const columns = useMemo(() => table.getAllColumns().filter((column) => column.getCanFilter()), [table])

  const onReset = useCallback(() => {
    table.resetColumnFilters()
  }, [table])

  return (
    <div
      role='toolbar'
      aria-orientation='horizontal'
      className={cn('flex w-full items-start justify-between gap-2 p-1', className)}
      {...rest}
    >
      <div className='flex flex-1 flex-wrap items-center gap-2'>
        {columns.map((column) => (
          <DataTableToolbarFilter key={column.id} column={column} />
        ))}
        {isFiltered && (
          <Button aria-label='Reset filters' variant='outline' size='sm' className='border-dashed' onClick={onReset}>
            <XIcon />
            Reset
          </Button>
        )}
      </div>
      <div className='flex items-center gap-2'>
        {children}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}

type DataTableToolbarFilterProps<TData> = {
  column: Column<TData>
}

const DataTableToolbarFilter = <TData,>({ column }: DataTableToolbarFilterProps<TData>) => {
  const columnMeta = column.columnDef.meta

  const onFilterRender = useCallback(() => {
    if (!columnMeta?.variant) return null

    switch (columnMeta.variant) {
      case 'text': {
        return (
          <Input
            placeholder={columnMeta.placeholder ?? columnMeta.label}
            value={(column.getFilterValue() as string | undefined) ?? ''}
            onChange={(event) => {
              column.setFilterValue(event.target.value)
            }}
            className='h-8 w-40 lg:w-56'
          />
        )
      }

      case 'number': {
        return (
          <div className='relative'>
            <Input
              type='number'
              inputMode='numeric'
              placeholder={columnMeta.placeholder ?? columnMeta.label}
              value={(column.getFilterValue() as string | undefined) ?? ''}
              onChange={(event) => {
                column.setFilterValue(event.target.value)
              }}
              className={cn('h-8 w-[120px]', columnMeta.unit && 'pr-8')}
            />
            {columnMeta.unit && (
              <span className='absolute top-0 right-0 bottom-0 flex items-center rounded-r-md bg-accent px-2 text-sm text-muted-foreground'>
                {columnMeta.unit}
              </span>
            )}
          </div>
        )
      }

      case 'range': {
        return <DataTableSliderFilter column={column} title={columnMeta.label ?? column.id} />
      }

      case 'date':
      case 'dateRange': {
        return (
          <DataTableDateFilter
            column={column}
            title={columnMeta.label ?? column.id}
            multiple={columnMeta.variant === 'dateRange'}
          />
        )
      }

      case 'select':
      case 'multiSelect': {
        return (
          <DataTableFacetedFilter
            column={column}
            title={columnMeta.label ?? column.id}
            options={columnMeta.options ?? []}
            multiple={columnMeta.variant === 'multiSelect'}
          />
        )
      }

      default: {
        return null
      }
    }
  }, [column, columnMeta])

  return onFilterRender()
}

export { DataTableToolbar }
