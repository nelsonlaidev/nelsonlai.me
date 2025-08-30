/**
 * shadcn-table (MIT License)
 * Copyright (c) Sadman Sakib
 * Source: https://github.com/sadmann7/shadcn-table/blob/67bfe74c0454c7f657aa22c3d39a4926d6ebaf37/src/components/data-table/data-table-view-options.tsx
 *
 * Modified by: Nelson Lai
 */
'use client'

import type { Table } from '@tanstack/react-table'

import { cn } from '@repo/utils'
import { CheckIcon, ChevronsUpDownIcon, Settings2Icon } from 'lucide-react'
import { useId, useMemo, useState } from 'react'

import { Button } from './button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './command'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

type DataTableViewOptionsProps<TData> = {
  table: Table<TData>
} & React.ComponentProps<'button'>

const DataTableViewOptions = <TData,>(props: DataTableViewOptionsProps<TData>) => {
  const { table, className, ...rest } = props
  const [open, setOpen] = useState(false)
  const id = useId()
  const columns = useMemo(
    () => table.getAllColumns().filter((column) => column.accessorFn !== undefined && column.getCanHide()),
    [table]
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          aria-label='Toggle columns'
          role='combobox'
          aria-controls={id}
          aria-expanded={open}
          variant='outline'
          size='sm'
          className={cn('ml-auto hidden h-8 lg:flex', className)}
          {...rest}
        >
          <Settings2Icon />
          View
          <ChevronsUpDownIcon className='ml-auto opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent align='end' className='w-44 p-0'>
        <Command>
          <CommandInput placeholder='Search columns...' />
          <CommandList aria-labelledby={id}>
            <CommandEmpty>No columns found.</CommandEmpty>
            <CommandGroup>
              {columns.map((column) => (
                <CommandItem key={column.id} onSelect={() => column.toggleVisibility(!column.getIsVisible())}>
                  <span className='truncate'>{column.columnDef.meta?.label ?? column.id}</span>
                  <CheckIcon
                    className={cn('ml-auto size-4 shrink-0', column.getIsVisible() ? 'opacity-100' : 'opacity-0')}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export { DataTableViewOptions }
