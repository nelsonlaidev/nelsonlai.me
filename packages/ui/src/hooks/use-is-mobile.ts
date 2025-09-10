import { useEffect, useState } from 'react'

const MOBILE_BREAKPOINT = 768

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState<boolean | undefined>()

  useEffect(() => {
    const mql = globalThis.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener('change', onChange)

    // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect -- Valid
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)

    return () => {
      mql.removeEventListener('change', onChange)
    }
  }, [])

  return !!isMobile
}
