/**
 * shadcn-table (MIT License)
 * Copyright (c) Sadman Sakib
 * Source: https://github.com/sadmann7/shadcn-table/blob/67bfe74c0454c7f657aa22c3d39a4926d6ebaf37/src/components/data-table/data-table-sort-list.tsx
 *
 * Modified by: Nelson Lai
 */
'use client'

import type { ColumnSort, SortDirection, Table } from '@tanstack/react-table'

import { cn } from '@repo/utils'
import { ArrowDownUp, ChevronsUpDown, GripVertical, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'

import { dataTableConfig } from '../lib/data-table'

import { Badge } from './badge'
import { Button } from './button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './command'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'
import { Sortable, SortableContent, SortableItem, SortableItemHandle, SortableOverlay } from './sortable'

const OPEN_MENU_SHORTCUT = 's'
const REMOVE_SORT_SHORTCUTS = new Set(['backspace', 'delete'])

type DataTableSortListProps<TData> = {
  table: Table<TData>
} & React.ComponentProps<typeof PopoverContent>

const DataTableSortList = <TData,>(props: DataTableSortListProps<TData>) => {
  const { table, ...rest } = props
  const id = useId()
  const labelId = useId()
  const descriptionId = useId()
  const [open, setOpen] = useState(false)
  const addButtonRef = useRef<HTMLButtonElement>(null)

  const sorting = table.getState().sorting
  const onSortingChange = table.setSorting

  const { columnLabels, columns } = useMemo(() => {
    const labels = new Map<string, string>()
    const sortingIds = new Set(sorting.map((s) => s.id))
    const availableColumns: Array<{ id: string; label: string }> = []

    for (const column of table.getAllColumns()) {
      if (!column.getCanSort()) continue

      const label = column.columnDef.meta?.label ?? column.id
      labels.set(column.id, label)

      if (!sortingIds.has(column.id)) {
        availableColumns.push({ id: column.id, label })
      }
    }

    return {
      columnLabels: labels,
      columns: availableColumns
    }
  }, [sorting, table])

  const onSortAdd = useCallback(() => {
    const firstColumn = columns[0]
    if (!firstColumn) return
    onSortingChange((prevSorting) => [...prevSorting, { id: firstColumn.id, desc: false }])
  }, [columns, onSortingChange])

  const onSortUpdate = useCallback(
    (sortId: string, updates: Partial<ColumnSort>) => {
      onSortingChange((prevSorting) => prevSorting.map((sort) => (sort.id === sortId ? { ...sort, ...updates } : sort)))
    },
    [onSortingChange]
  )

  const onSortRemove = useCallback(
    (sortId: string) => {
      onSortingChange((prevSorting) => prevSorting.filter((item) => item.id !== sortId))
    },
    [onSortingChange]
  )

  const onSortingReset = useCallback(
    () => onSortingChange(table.initialState.sorting),
    [onSortingChange, table.initialState.sorting]
  )

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return
      }

      if (event.key.toLowerCase() === OPEN_MENU_SHORTCUT && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
        event.preventDefault()
        setOpen(true)
      }

      if (event.key.toLowerCase() === OPEN_MENU_SHORTCUT && event.shiftKey && sorting.length > 0) {
        event.preventDefault()
        onSortingReset()
      }
    }

    globalThis.addEventListener('keydown', onKeyDown)
    return () => globalThis.removeEventListener('keydown', onKeyDown)
  }, [sorting.length, onSortingReset])

  const onTriggerKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (REMOVE_SORT_SHORTCUTS.has(event.key.toLowerCase()) && sorting.length > 0) {
        event.preventDefault()
        onSortingReset()
      }
    },
    [sorting.length, onSortingReset]
  )

  return (
    <Sortable value={sorting} onValueChange={onSortingChange} getItemValue={(item) => item.id}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant='outline' size='sm' onKeyDown={onTriggerKeyDown}>
            <ArrowDownUp />
            Sort
            {sorting.length > 0 && (
              <Badge
                variant='secondary'
                className='h-[18.24px] rounded-[3.2px] px-[5.12px] font-mono text-[10.4px] font-normal'
              >
                {sorting.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          aria-labelledby={labelId}
          aria-describedby={descriptionId}
          className='max-w-(--radix-popover-content-available-width) origin-(--radix-popover-content-transform-origin) flex w-full flex-col gap-3.5 p-4 sm:min-w-[380px]'
          {...rest}
        >
          <div className='flex flex-col gap-1'>
            <h4 id={labelId} className='font-medium leading-none'>
              {sorting.length > 0 ? 'Sort by' : 'No sorting applied'}
            </h4>
            <p id={descriptionId} className={cn('text-muted-foreground text-sm', sorting.length > 0 && 'sr-only')}>
              {sorting.length > 0 ? 'Modify sorting to organize your rows.' : 'Add sorting to organize your rows.'}
            </p>
          </div>
          {sorting.length > 0 && (
            <SortableContent asChild>
              <div role='list' className='flex max-h-[300px] flex-col gap-2 overflow-y-auto p-1'>
                {sorting.map((sort) => (
                  <DataTableSortItem
                    key={sort.id}
                    sort={sort}
                    sortItemId={`${id}-sort-${sort.id}`}
                    columns={columns}
                    columnLabels={columnLabels}
                    onSortUpdate={onSortUpdate}
                    onSortRemove={onSortRemove}
                  />
                ))}
              </div>
            </SortableContent>
          )}
          <div className='flex w-full items-center gap-2'>
            <Button
              size='sm'
              className='rounded'
              ref={addButtonRef}
              onClick={onSortAdd}
              disabled={columns.length === 0}
            >
              Add sort
            </Button>
            {sorting.length > 0 && (
              <Button variant='outline' size='sm' className='rounded' onClick={onSortingReset}>
                Reset sorting
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>
      <SortableOverlay>
        <div className='flex items-center gap-2'>
          <div className='bg-primary/10 h-8 w-[180px] rounded-sm' />
          <div className='bg-primary/10 h-8 w-24 rounded-sm' />
          <div className='bg-primary/10 size-8 shrink-0 rounded-sm' />
          <div className='bg-primary/10 size-8 shrink-0 rounded-sm' />
        </div>
      </SortableOverlay>
    </Sortable>
  )
}

type DataTableSortItemProps = {
  sort: ColumnSort
  sortItemId: string
  columns: Array<{ id: string; label: string }>
  columnLabels: Map<string, string>
  onSortUpdate: (sortId: string, updates: Partial<ColumnSort>) => void
  onSortRemove: (sortId: string) => void
}

const DataTableSortItem = (props: DataTableSortItemProps) => {
  const { sort, sortItemId, columns, columnLabels, onSortUpdate, onSortRemove } = props
  const fieldListboxId = `${sortItemId}-field-listbox`
  const fieldTriggerId = `${sortItemId}-field-trigger`
  const directionListboxId = `${sortItemId}-direction-listbox`

  const [showFieldSelector, setShowFieldSelector] = useState(false)
  const [showDirectionSelector, setShowDirectionSelector] = useState(false)

  return (
    <SortableItem value={sort.id} asChild>
      <div role='listitem' id={sortItemId} className='flex items-center gap-2'>
        <Popover open={showFieldSelector} onOpenChange={setShowFieldSelector}>
          <PopoverTrigger asChild>
            <Button
              id={fieldTriggerId}
              role='combobox'
              aria-controls={fieldListboxId}
              aria-expanded={showFieldSelector}
              variant='outline'
              size='sm'
              className='w-44 justify-between rounded font-normal'
            >
              <span className='truncate'>{columnLabels.get(sort.id)}</span>
              <ChevronsUpDown className='opacity-50' />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            id={fieldListboxId}
            className='w-(--radix-popover-trigger-width) origin-(--radix-popover-content-transform-origin) p-0'
          >
            <Command>
              <CommandInput placeholder='Search fields...' />
              <CommandList aria-labelledby={fieldListboxId}>
                <CommandEmpty>No fields found.</CommandEmpty>
                <CommandGroup>
                  {columns.map((column) => (
                    <CommandItem
                      key={column.id}
                      value={column.id}
                      onSelect={(value) => onSortUpdate(sort.id, { id: value })}
                    >
                      <span className='truncate'>{column.label}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <Select
          open={showDirectionSelector}
          onOpenChange={setShowDirectionSelector}
          value={sort.desc ? 'desc' : 'asc'}
          onValueChange={(value: SortDirection) => onSortUpdate(sort.id, { desc: value === 'desc' })}
        >
          <SelectTrigger aria-controls={directionListboxId} className='h-8 w-24 rounded [&[data-size]]:h-8'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent
            id={directionListboxId}
            className='min-w-(--radix-select-trigger-width) origin-(--radix-select-content-transform-origin)'
          >
            {dataTableConfig.sortOrders.map((order) => (
              <SelectItem key={order.value} value={order.value}>
                {order.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          aria-controls={sortItemId}
          variant='outline'
          size='icon'
          className='size-8 shrink-0 rounded'
          onClick={() => onSortRemove(sort.id)}
        >
          <Trash2 />
        </Button>
        <SortableItemHandle asChild>
          <Button variant='outline' size='icon' className='size-8 shrink-0 rounded'>
            <GripVertical />
          </Button>
        </SortableItemHandle>
      </div>
    </SortableItem>
  )
}

export { DataTableSortList }
