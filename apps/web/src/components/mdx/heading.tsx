/*
 * fumadocs (MIT License)
 * Copyright (c) fuma-nama
 * Source: https://github.com/fuma-nama/fumadocs/blob/82c273917280f63da95687852135f89a08593e71/packages/ui/src/components/heading.tsx
 *
 * Modified by: Nelson Lai
 */
import { useTranslations } from '@repo/i18n/client'
import { cn } from '@repo/utils'
import { LinkIcon } from 'lucide-react'

import Link from '../link'

type Types = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
type HeadingProps<T extends Types> = Omit<React.ComponentProps<T>, 'as'> & {
  as?: T
}

const Heading = <T extends Types = 'h1'>(props: HeadingProps<T>) => {
  const { as, className, children, id, ...rest } = props
  const Component = as ?? 'h1'
  const t = useTranslations()

  return (
    <Component className={cn('scroll-m-32', className)} id={id} {...rest}>
      <Link href={`#${id}`} className='group'>
        {children}
        <LinkIcon
          aria-label={t('mdx.link-to-section')}
          className='ml-2 inline size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100'
        />
      </Link>
    </Component>
  )
}

export default Heading
