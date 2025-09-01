import { cn } from '@repo/utils'

type SkeletonProps = React.ComponentProps<'div'>

const Skeleton = (props: SkeletonProps) => {
  const { className, ...rest } = props

  return <div data-slot='skeleton' className={cn('animate-pulse rounded-md bg-accent', className)} {...rest} />
}

export { Skeleton }
