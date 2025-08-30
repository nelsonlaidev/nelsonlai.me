import { cn } from '@repo/utils'
import { cva, type VariantProps } from 'cva'

const alertVariants = cva({
  base: [
    'relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-lg border px-4 py-3 text-sm',
    'has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3',
    '[&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current'
  ],
  variants: {
    variant: {
      default: 'bg-card text-card-foreground',
      destructive: 'text-destructive bg-card *:data-[slot=alert-description]:text-destructive/90 [&>svg]:text-current'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

type AlertProps = React.ComponentProps<'div'> & VariantProps<typeof alertVariants>

const Alert = (props: AlertProps) => {
  const { className, variant, ...rest } = props

  return <div data-slot='alert' role='alert' className={cn(alertVariants({ variant }), className)} {...rest} />
}

type AlertTitleProps = React.ComponentProps<'div'>

const AlertTitle = (props: AlertTitleProps) => {
  const { className, ...rest } = props

  return (
    <div
      data-slot='alert-title'
      className={cn('col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight', className)}
      {...rest}
    />
  )
}

type AlertDescriptionProps = React.ComponentProps<'div'>

const AlertDescription = (props: AlertDescriptionProps) => {
  const { className, ...rest } = props

  return (
    <div
      data-slot='alert-description'
      className={cn(
        'text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed',
        className
      )}
      {...rest}
    />
  )
}

export { Alert, AlertDescription, AlertTitle }
