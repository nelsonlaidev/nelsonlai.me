import { keepPreviousData, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { orpc } from '@/orpc/client'

export const useGuestbookMessages = () => {
  return useInfiniteQuery(
    orpc.guestbook.list.infiniteOptions({
      input: (pageParam: Date | undefined) => ({ cursor: pageParam }),
      initialPageParam: undefined,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      placeholderData: keepPreviousData
    })
  )
}

export const useCreateGuestbookMessage = (onSuccess?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation(
    orpc.guestbook.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.guestbook.list.key() })
        onSuccess?.()
      }
    })
  )
}

export const useDeleteGuestbookMessage = (onSuccess?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation(
    orpc.guestbook.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.guestbook.list.key() })
        onSuccess?.()
      }
    })
  )
}
