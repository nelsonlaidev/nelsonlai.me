'use client'

import { Separator } from '@repo/ui/components/separator'
import { motion } from 'motion/react'

type PageTitleProps = {
  title: string
  description: string
  animate?: boolean
}

const animation = {
  hide: {
    x: -30,
    opacity: 0
  },
  show: {
    x: 0,
    opacity: 1
  }
}

const PageTitle = (props: PageTitleProps) => {
  const { title, description, animate = true } = props

  return (
    <div className='mt-6 mb-16 sm:mt-12 sm:mb-24'>
      <motion.h1
        className='my-4 text-4xl font-bold md:text-5xl'
        {...(animate && {
          initial: animation.hide,
          animate: animation.show
        })}
      >
        {title}
      </motion.h1>
      <motion.h2
        className='mb-8 text-muted-foreground'
        {...(animate && {
          initial: animation.hide,
          animate: animation.show,
          transition: {
            delay: 0.1
          }
        })}
      >
        {description}
      </motion.h2>
      <Separator className='absolute inset-x-0 translate-y-2 sm:translate-y-6' />
    </div>
  )
}

export default PageTitle
