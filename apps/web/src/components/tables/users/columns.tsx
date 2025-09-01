import type { ListAllUsersOutput } from '@/orpc/routers'
import type { ColumnDef } from '@tanstack/react-table'

import FormattedDateCell from '../formatted-date-cell'

export type User = ListAllUsersOutput['users'][number]

export const columns: Array<ColumnDef<User>> = [
  {
    accessorKey: 'id',
    header: 'ID'
  },
  {
    accessorKey: 'name',
    header: 'Name'
  },
  {
    accessorKey: 'email',
    header: 'Email'
  },
  {
    accessorKey: 'role',
    header: 'Role'
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => {
      return <FormattedDateCell date={row.original.createdAt} />
    }
  }
]
