/**
 * shadcn-table (MIT License)
 * Copyright (c) Sadman Sakib
 * Source: https://github.com/sadmann7/shadcn-table/blob/67bfe74c0454c7f657aa22c3d39a4926d6ebaf37/src/components/data-table/data-table.tsx
 *
 * Modified by: Nelson Lai
 */
import { cn } from '@repo/utils'
import { type ColumnSort, flexRender, type RowData, type Table as TanstackTable } from '@tanstack/react-table'

import { type DataTableConfig, getCommonPinningStyles } from '../lib/data-table'

import { DataTablePagination } from './data-table-pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table'

declare module '@tanstack/react-table' {
  // eslint-disable-next-line unused-imports/no-unused-vars -- must have identical type parameters
  type ColumnMeta<TData extends RowData, TValue> = {
    label?: string
    placeholder?: string
    variant?: FilterVariant
    options?: Option[]
    range?: [number, number]
    unit?: string
    icon?: React.FC<React.SVGProps<SVGSVGElement>>
  }
}

export type Option = {
  label: string
  value: string
  count?: number
  icon?: React.FC<React.SVGProps<SVGSVGElement>>
}

export type FilterOperator = DataTableConfig['operators'][number]
export type FilterVariant = DataTableConfig['filterVariants'][number]
export type JoinOperator = DataTableConfig['joinOperators'][number]

export type ExtendedColumnSort<TData> = {
  id: Extract<keyof TData, string>
} & Omit<ColumnSort, 'id'>

type DataTableProps<TData> = {
  table: TanstackTable<TData>
  actionBar?: React.ReactNode
} & React.ComponentProps<'div'>

const DataTable = <TData,>(props: DataTableProps<TData>) => {
  const { table, actionBar, children, className, ...rest } = props

  return (
    <div className={cn('flex w-full flex-col gap-2.5 overflow-auto', className)} {...rest}>
      {children}
      <div className='overflow-hidden rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{
                      ...getCommonPinningStyles({ column: header.column })
                    }}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        ...getCommonPinningStyles({ column: cell.column })
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={table.getAllColumns().length} className='h-24 text-center'>
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex flex-col gap-2.5'>
        <DataTablePagination table={table} />
        {actionBar !== undefined && table.getFilteredSelectedRowModel().rows.length > 0 && actionBar}
      </div>
    </div>
  )
}

export { DataTable }
export * from './data-table-column-header'
export * from './data-table-date-filter'
export * from './data-table-faceted-filter'
export * from './data-table-pagination'
export * from './data-table-skeleton'
export * from './data-table-slider-filter'
export * from './data-table-sort-list'
export * from './data-table-toolbar'
export * from './data-table-view-options'
