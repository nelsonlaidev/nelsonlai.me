import { cn } from '@repo/utils'

type TableProps = React.ComponentProps<'table'>

const Table = (props: TableProps) => {
  const { className, ...rest } = props

  return (
    <div data-slot='table-container' className='relative w-full overflow-x-auto'>
      {/* eslint-disable-next-line sonarjs/table-header -- it's a component */}
      <table data-slot='table' className={cn('w-full caption-bottom text-sm', className)} {...rest} />
    </div>
  )
}

type TableHeaderProps = React.ComponentProps<'thead'>

const TableHeader = (props: TableHeaderProps) => {
  const { className, ...rest } = props

  return <thead data-slot='table-header' className={cn('[&_tr]:border-b', className)} {...rest} />
}

type TableBodyProps = React.ComponentProps<'tbody'>

const TableBody = (props: TableBodyProps) => {
  const { className, ...rest } = props

  return <tbody data-slot='table-body' className={cn('[&_tr:last-child]:border-0', className)} {...rest} />
}

type TableFooterProps = React.ComponentProps<'tfoot'>

const TableFooter = (props: TableFooterProps) => {
  const { className, ...rest } = props

  return (
    <tfoot
      data-slot='table-footer'
      className={cn('bg-muted/50 border-t font-medium [&>tr]:last:border-b-0', className)}
      {...rest}
    />
  )
}

type TableRowProps = React.ComponentProps<'tr'>

const TableRow = (props: TableRowProps) => {
  const { className, ...rest } = props

  return (
    <tr
      data-slot='table-row'
      className={cn('hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors', className)}
      {...rest}
    />
  )
}

type TableHeadProps = React.ComponentProps<'th'>

const TableHead = (props: TableHeadProps) => {
  const { className, ...rest } = props

  return (
    <th
      data-slot='table-head'
      className={cn(
        'text-foreground h-10 whitespace-nowrap px-2 text-left align-middle font-medium [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
        className
      )}
      {...rest}
    />
  )
}

type TableCellProps = React.ComponentProps<'td'>

const TableCell = (props: TableCellProps) => {
  const { className, ...rest } = props

  return (
    <td
      data-slot='table-cell'
      className={cn(
        'whitespace-nowrap p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
        className
      )}
      {...rest}
    />
  )
}

type TableCaptionProps = React.ComponentProps<'caption'>

const TableCaption = (props: TableCaptionProps) => {
  const { className, ...rest } = props

  return <caption data-slot='table-caption' className={cn('text-muted-foreground mt-4 text-sm', className)} {...rest} />
}

export { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow }
