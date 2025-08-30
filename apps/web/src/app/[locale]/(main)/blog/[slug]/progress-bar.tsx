'use client'

import { motion, useScroll } from 'motion/react'

const ProgressBar = () => {
  const { scrollYProgress } = useScroll()

  return (
    <motion.div
      className='fixed inset-x-0 top-0 z-50 h-1 origin-[0%] bg-foreground'
      style={{
        scaleX: scrollYProgress
      }}
    />
  )
}

export default ProgressBar
