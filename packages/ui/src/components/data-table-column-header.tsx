/**
 * shadcn-table (MIT License)
 * Copyright (c) Sadman Sakib
 * Source: https://github.com/sadmann7/shadcn-table/blob/67bfe74c0454c7f657aa22c3d39a4926d6ebaf37/src/components/data-table/data-table-column-header.tsx
 *
 * Modified by: Nelson Lai
 */
import type { Column } from '@tanstack/react-table'

import { cn } from '@repo/utils'
import { ChevronDownIcon, ChevronsUpDownIcon, ChevronUpIcon, EyeOffIcon, XIcon } from 'lucide-react'

import { buttonVariants } from './button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from './dropdown-menu'

type DataTableColumnHeaderProps<TData, TValue> = {
  column: Column<TData, TValue>
  title: string
} & React.ComponentProps<'button'>

const DataTableColumnHeader = <TData, TValue>(props: DataTableColumnHeaderProps<TData, TValue>) => {
  const { column, title, className, ...rest } = props

  if (!column.getCanSort() && !column.getCanHide()) {
    return <div className={cn(className)}>{title}</div>
  }

  const isDesc = column.getIsSorted() === 'desc'
  const isAsc = column.getIsSorted() === 'asc'
  const isUnsorted = !isDesc && !isAsc

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          '-ml-1.5 h-8 py-1.5',
          'data-[state=open]:bg-accent',
          'has-[>svg]:px-2',
          className
        )}
        {...rest}
      >
        {title}
        {column.getCanSort() && (
          <>
            {isDesc && <ChevronDownIcon />}
            {isAsc && <ChevronUpIcon />}
            {isUnsorted && <ChevronsUpDownIcon />}
          </>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start' className='w-28'>
        {column.getCanSort() && (
          <>
            <DropdownMenuCheckboxItem
              className='[&_svg]:text-muted-foreground relative pl-2 pr-8 [&>span:first-child]:left-auto [&>span:first-child]:right-2'
              checked={column.getIsSorted() === 'asc'}
              onClick={() => column.toggleSorting(false)}
            >
              <ChevronUpIcon />
              Asc
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              className='[&_svg]:text-muted-foreground relative pl-2 pr-8 [&>span:first-child]:left-auto [&>span:first-child]:right-2'
              checked={column.getIsSorted() === 'desc'}
              onClick={() => column.toggleSorting(true)}
            >
              <ChevronDownIcon />
              Desc
            </DropdownMenuCheckboxItem>
            {column.getIsSorted() && (
              <DropdownMenuItem className='[&_svg]:text-muted-foreground pl-2' onClick={() => column.clearSorting()}>
                <XIcon />
                Reset
              </DropdownMenuItem>
            )}
          </>
        )}
        {column.getCanHide() && (
          <DropdownMenuCheckboxItem
            className='[&_svg]:text-muted-foreground relative pl-2 pr-8 [&>span:first-child]:left-auto [&>span:first-child]:right-2'
            checked={!column.getIsVisible()}
            onClick={() => column.toggleVisibility(false)}
          >
            <EyeOffIcon />
            Hide
          </DropdownMenuCheckboxItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { DataTableColumnHeader }
