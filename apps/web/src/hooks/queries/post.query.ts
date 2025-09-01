import { keepPreviousData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { type Inputs, orpc, type Outputs } from '@/orpc/client'

export const usePostComments = (
  input: (pageParam: Date | undefined) => Inputs['posts']['comments']['list'],
  enabled = true
) => {
  return useInfiniteQuery(
    orpc.posts.comments.list.infiniteOptions({
      input,
      initialPageParam: undefined,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      placeholderData: keepPreviousData,
      enabled
    })
  )
}

export const usePostViewCount = (input: Inputs['posts']['views']['count']) => {
  return useQuery(orpc.posts.views.count.queryOptions({ input }))
}

export const usePostCommentCount = (input: Inputs['posts']['comments']['count']) => {
  return useQuery(orpc.posts.comments.count.queryOptions({ input }))
}

export const usePostReplyCount = (input: Inputs['posts']['replies']['count']) => {
  return useQuery(orpc.posts.replies.count.queryOptions({ input }))
}

export const usePostLikeCount = (input: Inputs['posts']['likes']['count']) => {
  return useQuery(orpc.posts.likes.count.queryOptions({ input }))
}

export const useIncrementPostViewCount = (input: Inputs['posts']['views']['count']) => {
  const queryClient = useQueryClient()

  return useMutation(
    orpc.posts.views.increment.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: orpc.posts.views.count.key({ input })
        })
      }
    })
  )
}

type PostLikeCountOutput = Outputs['posts']['likes']['count']

export const useLikePost = (input: Inputs['posts']['likes']['count']) => {
  const queryClient = useQueryClient()
  const queryKey = orpc.posts.likes.count.queryKey({ input: { slug: input.slug } })

  return useMutation(
    orpc.posts.likes.increment.mutationOptions({
      onMutate: async (newData) => {
        await queryClient.cancelQueries({ queryKey })

        const previousData = queryClient.getQueryData<PostLikeCountOutput>(queryKey)

        if (previousData) {
          queryClient.setQueryData<PostLikeCountOutput>(queryKey, {
            ...previousData,
            likes: previousData.likes + newData.value,
            currentUserLikes: previousData.currentUserLikes + newData.value
          })
        }

        return { previousData }
      },
      onError: (_error, _variables, context) => {
        if (context?.previousData) {
          queryClient.setQueryData(queryKey, context.previousData)
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: orpc.posts.likes.count.key({ input }) })
      }
    })
  )
}

export const useVotePostComment = (input: Inputs['posts']['comments']['list']) => {
  const queryClient = useQueryClient()

  return useMutation(
    orpc.posts.votes.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.posts.comments.list.key({ input }) })
      }
    })
  )
}

export const useCreatePostComment = (input: Inputs['posts']['comments']['list'], onSuccess?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation(
    orpc.posts.comments.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.posts.comments.list.key({ input }) })
        queryClient.invalidateQueries({ queryKey: orpc.posts.comments.count.key({ input }) })
        queryClient.invalidateQueries({ queryKey: orpc.posts.replies.count.key({ input }) })
        onSuccess?.()
      }
    })
  )
}

export const useDeletePostComment = (input: Inputs['posts']['comments']['list'], onSuccess?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation(
    orpc.posts.comments.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.posts.comments.list.key({ input }) })
        queryClient.invalidateQueries({ queryKey: orpc.posts.comments.count.key({ input }) })
        queryClient.invalidateQueries({ queryKey: orpc.posts.replies.count.key({ input }) })
        onSuccess?.()
      }
    })
  )
}
