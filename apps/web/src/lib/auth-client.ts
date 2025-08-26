import type { auth } from './auth'

import { toast } from '@repo/ui/components/sonner'
import { inferAdditionalFields } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'

const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>()],
  fetchOptions: {
    onError(e) {
      if (e.error.status === 429) {
        toast.error('Too many requests. Please try again later.')
      }
    }
  }
})

export const { signIn, signOut, useSession } = authClient

// export type Session = typeof authClient.$Infer.Session
export type User = (typeof authClient.$Infer.Session)['user']
