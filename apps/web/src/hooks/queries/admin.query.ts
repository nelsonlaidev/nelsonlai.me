import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { type Inputs, orpc } from '@/orpc/client'

export const useAdminComments = (input: Inputs['admin']['listAllComments']) => {
  return useQuery(orpc.admin.listAllComments.queryOptions({ input, placeholderData: keepPreviousData }))
}

export const useAdminUsers = (input: Inputs['admin']['listAllUsers']) => {
  return useQuery(orpc.admin.listAllUsers.queryOptions({ input, placeholderData: keepPreviousData }))
}
