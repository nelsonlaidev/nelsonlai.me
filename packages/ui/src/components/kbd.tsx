import { cn } from '@repo/utils'

type KbdProps = React.ComponentProps<'kbd'>

const Kbd = (props: KbdProps) => {
  const { className, ...rest } = props

  return (
    <kbd
      className={cn(
        'inline-flex items-center justify-center gap-1 rounded-md border bg-muted px-2 py-0.5 text-sm text-muted-foreground',
        className
      )}
      {...rest}
    />
  )
}

export { Kbd }
