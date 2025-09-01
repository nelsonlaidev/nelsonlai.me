import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { orpc } from '@/orpc/client'

export const useAdminComments = () => {
  return useQuery(orpc.admin.listAllComments.queryOptions({ placeholderData: keepPreviousData }))
}

export const useAdminUsers = () => {
  return useQuery(orpc.admin.listAllUsers.queryOptions({ placeholderData: keepPreviousData }))
}
