'use client'

import type { Post } from '@/lib/content'

import { useTranslations } from '@repo/i18n/client'
import { buttonVariants } from '@repo/ui/components/button'
import { cn } from '@repo/utils'
import { ArrowUpRightIcon, PencilIcon } from 'lucide-react'
import { motion, useInView } from 'motion/react'
import { useRef } from 'react'

import BlurImage from '@/components/blur-image'
import { usePostLikeCount, usePostViewCount } from '@/hooks/queries/post.query'
import { useFormattedDate } from '@/hooks/use-formatted-date'

import Link from '../link'

const variants = {
  initial: {
    y: 40,
    opacity: 0
  },
  animate: {
    y: 0,
    opacity: 1
  }
}

type LatestArticlesProps = {
  posts: Post[]
}

const LatestArticles = (props: LatestArticlesProps) => {
  const { posts } = props
  const projectsRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(projectsRef, { once: true, margin: '-100px' })
  const t = useTranslations()

  return (
    <motion.div
      initial='initial'
      animate={isInView ? 'animate' : 'initial'}
      variants={variants}
      ref={projectsRef}
      transition={{
        duration: 0.5
      }}
      className='my-24'
    >
      <motion.h2
        className='text-center text-3xl font-semibold'
        initial={{
          y: 30,
          opacity: 0
        }}
        animate={{
          y: 0,
          opacity: 1
        }}
        transition={{
          duration: 0.3
        }}
      >
        {t('homepage.latest-articles.title')}
      </motion.h2>
      <motion.div
        className='mt-12 grid gap-4 md:grid-cols-2'
        initial={{
          y: 40,
          opacity: 0
        }}
        animate={{
          y: 0,
          opacity: 1
        }}
        transition={{
          duration: 0.3
        }}
      >
        {posts.map((post) => (
          <Card key={post.slug} post={post} />
        ))}
      </motion.div>
      <div className='my-8 flex items-center justify-center'>
        <Link
          href='/blog'
          className={cn(
            buttonVariants({
              variant: 'outline'
            }),
            'rounded-xl'
          )}
        >
          {t('homepage.latest-articles.more')}
        </Link>
      </div>
    </motion.div>
  )
}

type CardProps = {
  post: Post
}

const Card = (props: CardProps) => {
  const { post } = props
  const formattedDate = useFormattedDate(post.date)
  const t = useTranslations()

  const viewsQuery = usePostViewCount({ slug: post.slug })
  const likesQuery = usePostLikeCount({ slug: post.slug })

  return (
    <Link href={`/blog/${post.slug}`} className='group relative rounded-xl p-2 shadow-feature-card'>
      <div className='flex items-center justify-between p-4'>
        <div className='flex items-center gap-3'>
          <PencilIcon className='size-[18px]' />
          <h2>{t('homepage.latest-articles.card')}</h2>
        </div>
        <ArrowUpRightIcon className='size-[18px] opacity-0 transition-opacity group-hover:opacity-100' />
      </div>
      <BlurImage
        width={1200}
        height={630}
        src={`/images/blog/${post.slug}/cover.png`}
        alt={post.title}
        className='rounded-lg'
      />
      <div className='flex items-center justify-between gap-2 px-2 pt-4 text-sm text-zinc-500'>
        {formattedDate}
        <div className='flex gap-2'>
          {likesQuery.status === 'pending' && '--'}
          {likesQuery.status === 'error' && t('common.error')}
          {likesQuery.status === 'success' && <div>{t('common.likes', { count: likesQuery.data.likes })}</div>}
          <div>&middot;</div>
          {viewsQuery.status === 'pending' && '--'}
          {viewsQuery.status === 'error' && t('common.error')}
          {viewsQuery.status === 'success' && <div>{t('common.views', { count: viewsQuery.data.views })}</div>}
        </div>
      </div>
      <div className='flex flex-col px-2 py-4 transition-transform ease-out group-hover:translate-x-0.5'>
        <h3 className='text-2xl font-semibold'>{post.title}</h3>
        <p className='mt-2 text-muted-foreground'>{post.summary}</p>
      </div>
    </Link>
  )
}

export default LatestArticles
