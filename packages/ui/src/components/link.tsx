import { cn } from '@repo/utils'
import { cva, type VariantProps } from 'cva'
import NextLink from 'next/link'

const linkVariants = cva({
  variants: {
    variant: {
      muted: 'text-muted-foreground transition-colors hover:text-foreground'
    }
  }
})

type LinkProps = Omit<React.ComponentProps<typeof NextLink>, 'href'> &
  VariantProps<typeof linkVariants> & {
    href: string
  }

const Link = (props: LinkProps) => {
  const { className, variant, href, children, ...rest } = props

  if (href.startsWith('/')) {
    return (
      <NextLink className={cn(linkVariants({ variant, className }))} href={href} {...rest}>
        {children}
      </NextLink>
    )
  }

  if (href.startsWith('#')) {
    return (
      <a className={cn(linkVariants({ variant, className }))} href={href} {...rest}>
        {children}
      </a>
    )
  }

  return (
    <a
      className={cn(linkVariants({ variant, className }))}
      target='_blank'
      rel='noopener noreferrer'
      href={href}
      {...rest}
    >
      {children}
    </a>
  )
}

export { Link, linkVariants }
