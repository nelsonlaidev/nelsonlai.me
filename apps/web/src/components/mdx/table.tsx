import { Table as UITable, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@repo/ui/components/table'

type TableProps = {
  headers: string[]
  rows: string[][]
}

const Table = (props: TableProps) => {
  const { headers, rows } = props

  return (
    <UITable className='not-prose'>
      <TableHeader>
        <TableRow>
          {headers.map((header, i) => (
            <TableHead key={`${i}`}>{header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row, i) => (
          <TableRow key={i}>
            {row.map((cell, j) => (
              <TableCell key={j}>{cell}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </UITable>
  )
}

export default Table
