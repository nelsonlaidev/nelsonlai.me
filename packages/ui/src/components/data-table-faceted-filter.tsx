/**
 * shadcn-table (MIT License)
 * Copyright (c) Sadman Sakib
 * Source: https://github.com/sadmann7/shadcn-table/blob/67bfe74c0454c7f657aa22c3d39a4926d6ebaf37/src/components/data-table/data-table-faceted-filter.tsx
 *
 * Modified by: Nelson Lai
 */
'use client'

import type { Option } from './data-table'
import type { Column } from '@tanstack/react-table'

import { cn } from '@repo/utils'
import { CheckIcon, PlusCircleIcon, XCircleIcon } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'

import { Badge } from './badge'
import { Button } from './button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from './command'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { Separator } from './separator'

type DataTableFacetedFilterProps<TData, TValue> = {
  column?: Column<TData, TValue>
  title?: string
  options: Option[]
  multiple?: boolean
}

const DataTableFacetedFilter = <TData, TValue>(props: DataTableFacetedFilterProps<TData, TValue>) => {
  const { column, title, options, multiple } = props
  const [open, setOpen] = useState(false)

  const columnFilterValue = column?.getFilterValue()
  const selectedValues = useMemo(
    () => new Set(Array.isArray(columnFilterValue) ? columnFilterValue : []),
    [columnFilterValue]
  )

  const onItemSelect = useCallback(
    (option: Option, isSelected: boolean) => {
      if (!column) return

      if (multiple) {
        const newSelectedValues = new Set(selectedValues)
        if (isSelected) {
          newSelectedValues.delete(option.value)
        } else {
          newSelectedValues.add(option.value)
        }
        const filterValues = Array.from(newSelectedValues)
        column.setFilterValue(filterValues.length > 0 ? filterValues : undefined)
      } else {
        column.setFilterValue(isSelected ? undefined : [option.value])
        setOpen(false)
      }
    },
    [column, multiple, selectedValues]
  )

  const onReset = useCallback(
    (event?: React.MouseEvent) => {
      event?.stopPropagation()
      column?.setFilterValue(undefined)
    },
    [column]
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant='outline' size='sm' className='border-dashed'>
          {selectedValues.size > 0 ? (
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
            <PlusCircleIcon />
          )}
          {title}
          {selectedValues.size > 0 && (
            <>
              <Separator orientation='vertical' className='mx-0.5 data-[orientation=vertical]:h-4' />
              <Badge variant='secondary' className='rounded-sm px-1 font-normal lg:hidden'>
                {selectedValues.size}
              </Badge>
              <div className='hidden items-center gap-1 lg:flex'>
                {selectedValues.size > 2 ? (
                  <Badge variant='secondary' className='rounded-sm px-1 font-normal'>
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge variant='secondary' key={option.value} className='rounded-sm px-1 font-normal'>
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[12.5rem] p-0' align='start'>
        <Command>
          <CommandInput placeholder={title} />
          <CommandList className='max-h-full'>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup className='max-h-[18.75rem] overflow-y-auto overflow-x-hidden'>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value)

                return (
                  <CommandItem key={option.value} onSelect={() => onItemSelect(option, isSelected)}>
                    <div
                      className={cn(
                        'border-primary flex size-4 items-center justify-center rounded-sm border',
                        isSelected ? 'bg-primary' : 'opacity-50 [&_svg]:invisible'
                      )}
                    >
                      <CheckIcon />
                    </div>
                    {option.icon && <option.icon />}
                    <span className='truncate'>{option.label}</span>
                    {option.count !== undefined && <span className='ml-auto font-mono text-xs'>{option.count}</span>}
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem onSelect={() => onReset()} className='justify-center text-center'>
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export { DataTableFacetedFilter }
