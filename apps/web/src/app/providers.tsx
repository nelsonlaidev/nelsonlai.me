'use client'

import { Toaster } from '@repo/ui/components/sonner'
import { TooltipProvider } from '@repo/ui/components/tooltip'
import { ThemeProvider } from 'next-themes'

import { ORPCQueryProvider } from '@/orpc/tanstack-query/client'

type ProvidesProps = {
  children: React.ReactNode
}

const Providers = (props: ProvidesProps) => {
  const { children } = props

  return (
    <ORPCQueryProvider>
      <ThemeProvider
        attribute='class'
        defaultTheme='system'
        enableSystem={true}
        enableColorScheme={true}
        disableTransitionOnChange={true}
      >
        <TooltipProvider>
          {children}
          <Toaster
            toastOptions={{
              duration: 2500
            }}
            visibleToasts={5}
            expand={true}
          />
        </TooltipProvider>
      </ThemeProvider>
    </ORPCQueryProvider>
  )
}

export default Providers
