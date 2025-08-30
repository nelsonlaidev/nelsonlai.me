/**
 * mantine (MIT License)
 * Copyright (c) Vitaly Rtishchev
 * Source: https://github.com/mantinedev/mantine/blob/ae20e40adfa26936d73e81b3ab30136f7997a19b/packages/%40mantine/hooks/src/use-debounced-callback/use-debounced-callback.ts
 *
 * Modified by: Nelson Lai
 */
import { useCallback, useEffect, useRef } from 'react'

import { useCallbackRef } from './use-callback-ref'

export const useDebouncedCallback = <T extends (...args: never[]) => unknown>(callback: T, delay: number) => {
  const handleCallback = useCallbackRef(callback)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  useEffect(
    () => () => {
      if (debounceTimerRef.current) {
        globalThis.clearTimeout(debounceTimerRef.current)
      }
    },
    []
  )

  const setValue = useCallback(
    (...args: Parameters<T>) => {
      if (debounceTimerRef.current) {
        globalThis.clearTimeout(debounceTimerRef.current)
      }
      debounceTimerRef.current = globalThis.setTimeout(() => handleCallback(...args), delay)
    },
    [handleCallback, delay]
  )

  return setValue
}
