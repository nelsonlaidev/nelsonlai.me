/**
 * primitives (MIT License)
 * Copyright (c) WorkOS
 * Source: https://github.com/radix-ui/primitives/blob/172586aeb3da8fddb98553e2144b6f1d0395a751/packages/react/use-callback-ref/src/use-callback-ref.tsx
 *
 * Modified by: Nelson Lai
 */
import { useEffect, useMemo, useRef } from 'react'

export const useCallbackRef = <T extends (...args: never[]) => unknown>(callback: T | undefined): T => {
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  })

  // https://github.com/facebook/react/issues/19240
  return useMemo(() => ((...args) => callbackRef.current?.(...args)) as T, [])
}
