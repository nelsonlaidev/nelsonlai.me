/**
 * shadcn-table (MIT License)
 * Copyright (c) Sadman Sakib
 * Source: https://github.com/sadmann7/shadcn-table/blob/67bfe74c0454c7f657aa22c3d39a4926d6ebaf37/src/hooks/use-data-table.ts
 *
 * Modified by: Nelson Lai
 */
import type { ExtendedColumnSort } from '../components/data-table'

import {
  type ColumnFiltersState,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  type TableOptions,
  type TableState,
  type Updater,
  useReactTable,
  type VisibilityState
} from '@tanstack/react-table'
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  type Parser,
  useQueryState,
  type UseQueryStateOptions,
  useQueryStates
} from 'nuqs'
import { type TransitionStartFunction, useCallback, useMemo, useState } from 'react'

import { DEFAULT_PAGE_SIZE_OPTIONS } from '../components/data-table-pagination'
import { getSortingStateParser } from '../lib/data-table'

import { useDebouncedCallback } from './use-debounced-callback'

const PAGE_KEY = 'page'
const PER_PAGE_KEY = 'perPage'
const SORT_KEY = 'sort'
const ARRAY_SEPARATOR = ','
const DEBOUNCE_MS = 300
const THROTTLE_MS = 50

type UseDataTableProps<TData> = {
  initialState?: {
    sorting?: Array<ExtendedColumnSort<TData>>
  } & Omit<Partial<TableState>, 'sorting'>
  history?: 'push' | 'replace'
  debounceMs?: number
  throttleMs?: number
  clearOnDefault?: boolean
  enableAdvancedFilter?: boolean
  scroll?: boolean
  shallow?: boolean
  startTransition?: TransitionStartFunction
} & Omit<
  TableOptions<TData>,
  'state' | 'pageCount' | 'getCoreRowModel' | 'manualFiltering' | 'manualPagination' | 'manualSorting'
> &
  Required<Pick<TableOptions<TData>, 'pageCount'>>

export const useDataTable = <TData>(props: UseDataTableProps<TData>) => {
  const {
    columns,
    pageCount,
    initialState,
    history = 'replace',
    debounceMs = DEBOUNCE_MS,
    throttleMs = THROTTLE_MS,
    clearOnDefault = false,
    enableAdvancedFilter = false,
    scroll = false,
    shallow = true,
    startTransition,
    ...tableProps
  } = props

  const queryStateOptions = useMemo<Omit<UseQueryStateOptions<string>, 'parse'>>(
    () => ({
      history,
      scroll,
      shallow,
      throttleMs,
      debounceMs,
      clearOnDefault,
      startTransition
    }),
    [history, scroll, shallow, throttleMs, debounceMs, clearOnDefault, startTransition]
  )

  const [rowSelection, setRowSelection] = useState<RowSelectionState>(initialState?.rowSelection ?? {})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(initialState?.columnVisibility ?? {})

  const [page, setPage] = useQueryState(PAGE_KEY, parseAsInteger.withOptions(queryStateOptions).withDefault(1))
  const [perPage, setPerPage] = useQueryState(
    PER_PAGE_KEY,
    parseAsInteger
      .withOptions(queryStateOptions)
      .withDefault(initialState?.pagination?.pageSize ?? DEFAULT_PAGE_SIZE_OPTIONS[0])
  )

  const pagination: PaginationState = useMemo(() => {
    return {
      pageIndex: page - 1, // Zero-based index -> one-based index
      pageSize: perPage
    }
  }, [page, perPage])

  const onPaginationChange = useCallback(
    (updaterOrValue: Updater<PaginationState>) => {
      if (typeof updaterOrValue === 'function') {
        const newPagination = updaterOrValue(pagination)
        setPage(newPagination.pageIndex + 1)
        setPerPage(newPagination.pageSize)
      } else {
        setPage(updaterOrValue.pageIndex + 1)
        setPerPage(updaterOrValue.pageSize)
      }
    },
    [pagination, setPage, setPerPage]
  )

  const columnIds = useMemo(() => {
    return new Set(columns.map((column) => column.id).filter(Boolean) as string[])
  }, [columns])

  const [sorting, setSorting] = useQueryState(
    SORT_KEY,
    getSortingStateParser<TData>(columnIds)
      .withOptions(queryStateOptions)
      .withDefault(initialState?.sorting ?? [])
  )

  const onSortingChange = useCallback(
    (updaterOrValue: Updater<SortingState>) => {
      if (typeof updaterOrValue === 'function') {
        const newSorting = updaterOrValue(sorting)
        setSorting(newSorting as Array<ExtendedColumnSort<TData>>)
      } else {
        setSorting(updaterOrValue as Array<ExtendedColumnSort<TData>>)
      }
    },
    [sorting, setSorting]
  )

  const filterableColumns = useMemo(() => {
    if (enableAdvancedFilter) return []

    return columns.filter((column) => column.enableColumnFilter)
  }, [columns, enableAdvancedFilter])

  const filterParsers = useMemo(() => {
    if (enableAdvancedFilter) {
      return {}
    }

    const parsers: Record<string, Parser<string> | Parser<string[]>> = {}

    for (const column of filterableColumns) {
      const key = column.id ?? ''
      parsers[key] = column.meta?.options
        ? parseAsArrayOf(parseAsString, ARRAY_SEPARATOR).withOptions(queryStateOptions)
        : parseAsString.withOptions(queryStateOptions)
    }

    return parsers
  }, [filterableColumns, queryStateOptions, enableAdvancedFilter])

  const [filterValues, setFilterValues] = useQueryStates(filterParsers)

  const debouncedSetFilterValues = useDebouncedCallback((values: typeof filterValues) => {
    setPage(1)
    setFilterValues(values)
  }, debounceMs)

  const initialColumnFilters: ColumnFiltersState = useMemo(() => {
    if (enableAdvancedFilter) return []

    const filters: ColumnFiltersState = []
    for (const [key, value] of Object.entries(filterValues)) {
      if (value !== null) {
        let processedValue: string[]
        if (Array.isArray(value)) {
          processedValue = value
        } else if (typeof value === 'string' && /[^a-zA-Z0-9]/.test(value)) {
          processedValue = value.split(/[^a-zA-Z0-9]+/).filter(Boolean)
        } else {
          processedValue = [value]
        }

        filters.push({
          id: key,
          value: processedValue
        })
      }
    }
    return filters
  }, [filterValues, enableAdvancedFilter])

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(initialColumnFilters)

  const onColumnFiltersChange = useCallback(
    (updaterOrValue: Updater<ColumnFiltersState>) => {
      if (enableAdvancedFilter) return

      setColumnFilters((prev) => {
        const next = typeof updaterOrValue === 'function' ? updaterOrValue(prev) : updaterOrValue

        const filterUpdates: Record<string, string | string[] | null> = {}
        for (const filter of next) {
          if (filterableColumns.some((column) => column.id === filter.id)) {
            filterUpdates[filter.id] = filter.value as string | string[]
          }
        }

        for (const prevFilter of prev) {
          if (!next.some((filter) => filter.id === prevFilter.id)) {
            filterUpdates[prevFilter.id] = null
          }
        }

        debouncedSetFilterValues(filterUpdates)
        return next
      })
    },
    [debouncedSetFilterValues, filterableColumns, enableAdvancedFilter]
  )

  const table = useReactTable({
    ...tableProps,
    columns,
    initialState,
    pageCount,
    state: {
      pagination,
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters
    },
    defaultColumn: {
      ...tableProps.defaultColumn,
      enableColumnFilter: false
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onPaginationChange,
    onSortingChange,
    onColumnFiltersChange,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true
  })

  return { table, shallow, debounceMs, throttleMs }
}
