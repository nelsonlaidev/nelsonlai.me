import { type QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { IS_SERVER } from '@/lib/constants'

import { makeQueryClient } from './query-client'

let browserQueryClient: QueryClient | undefined

const getQueryClient = () => {
  if (IS_SERVER) {
    // Server: always make a new query client
    return makeQueryClient()
  } else {
    /*
     * Browser: make a new query client if we don't already have one
     * This is very important, so we don't re-make a new client if React
     * suspends during the initial render. This may not be needed if we
     * have a suspense boundary BELOW the creation of the query client
     */
    browserQueryClient ??= makeQueryClient()
    return browserQueryClient
  }
}

type ORPCQueryProviderProps = {
  children: React.ReactNode
}

export const ORPCQueryProvider = (props: ORPCQueryProviderProps) => {
  const { children } = props
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}
