import { useEffect, useState } from 'react'

export const useIsMounted = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect -- Valid
    setIsMounted(true)
    return () => {
      setIsMounted(false)
    }
  }, [])

  return isMounted
}
