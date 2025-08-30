/**
 * shadcn-table (MIT License)
 * Copyright (c) Sadman Sakib
 * Source: https://github.com/sadmann7/shadcn-table/blob/67bfe74c0454c7f657aa22c3d39a4926d6ebaf37/src/components/data-table/data-table-skeleton.tsx
 *
 * Modified by: Nelson Lai
 */
import { cn, range } from '@repo/utils'

import { Skeleton } from './skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table'

type DataTableSkeletonProps = {
  columnCount: number
  rowCount?: number
  filterCount?: number
  cellWidths?: string[]
  withViewOptions?: boolean
  withPagination?: boolean
  shrinkZero?: boolean
} & React.ComponentProps<'div'>

const DEFAULT_CELL_WIDTHS = ['auto']

const DataTableSkeleton = (props: DataTableSkeletonProps) => {
  const {
    columnCount,
    rowCount = 10,
    filterCount = 0,
    cellWidths = DEFAULT_CELL_WIDTHS,
    withViewOptions = true,
    withPagination = true,
    shrinkZero = false,
    className,
    ...rest
  } = props

  const cozyCellWidths = range(columnCount).map((i) => cellWidths[i % cellWidths.length] ?? 'auto')

  return (
    <div className={cn('flex w-full flex-col gap-2.5 overflow-auto', className)} {...rest}>
      <div className='flex w-full items-center justify-between gap-2 overflow-auto p-1'>
        <div className='flex flex-1 items-center gap-2'>
          {filterCount > 0
            ? range(filterCount).map((i) => <Skeleton key={i} className='h-7 w-[4.5rem] border-dashed' />)
            : null}
        </div>
        {withViewOptions ? <Skeleton className='ml-auto hidden h-7 w-[4.5rem] lg:flex' /> : null}
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {range(1).map((i) => (
              <TableRow key={i} className='hover:bg-transparent'>
                {range(columnCount).map((j) => (
                  <TableHead
                    key={j}
                    style={{
                      width: cozyCellWidths[j],
                      minWidth: shrinkZero ? cozyCellWidths[j] : 'auto'
                    }}
                  >
                    <Skeleton className='h-6 w-full' />
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {range(rowCount).map((i) => (
              <TableRow key={i} className='hover:bg-transparent'>
                {range(columnCount).map((j) => (
                  <TableCell
                    key={j}
                    style={{
                      width: cozyCellWidths[j],
                      minWidth: shrinkZero ? cozyCellWidths[j] : 'auto'
                    }}
                  >
                    <Skeleton className='h-6 w-full' />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {withPagination ? (
        <div className='flex w-full items-center justify-between gap-4 overflow-auto p-1 sm:gap-8'>
          <Skeleton className='h-7 w-40 shrink-0' />
          <div className='flex items-center gap-4 sm:gap-6 lg:gap-8'>
            <div className='flex items-center gap-2'>
              <Skeleton className='h-7 w-24' />
              <Skeleton className='h-7 w-[4.5rem]' />
            </div>
            <div className='flex items-center justify-center text-sm font-medium'>
              <Skeleton className='h-7 w-20' />
            </div>
            <div className='flex items-center gap-2'>
              <Skeleton className='hidden size-7 lg:block' />
              <Skeleton className='size-7' />
              <Skeleton className='size-7' />
              <Skeleton className='hidden size-7 lg:block' />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export { DataTableSkeleton }
