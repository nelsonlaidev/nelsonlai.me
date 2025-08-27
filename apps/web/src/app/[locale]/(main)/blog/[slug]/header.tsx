'use client'

import type { Post } from 'content-collections'

import NumberFlow from '@number-flow/react'
import { useTranslations } from '@repo/i18n/client'
import { useEffect, useRef } from 'react'

import BlurImage from '@/components/blur-image'
import ImageZoom from '@/components/image-zoom'
import Link from '@/components/link'
import {
  useIncrementPostViewCount,
  usePostCommentCount,
  usePostViewCount
} from '@/hooks/queries/post.query'
import { useFormattedDate } from '@/hooks/use-formatted-date'

type HeaderProps = {
  post: Post
}

const Header = (props: HeaderProps) => {
  const { post } = props
  const formattedDate = useFormattedDate(post.date)
  const t = useTranslations()

  const viewCountQuery = usePostViewCount({ slug: post.slug })
  const commentCountQuery = usePostCommentCount({ slug: post.slug, withReplies: true })

  const { mutate: incrementPostView } = useIncrementPostViewCount({ slug: post.slug })

  const incremented = useRef(false)

  useEffect(() => {
    if (!incremented.current) {
      incrementPostView({ slug: post.slug })
      incremented.current = true
    }
  }, [incrementPostView, post.slug])

  return (
    <div className='space-y-16 py-16'>
      <div className='space-y-16 sm:px-8'>
        <h1 className='bg-linear-to-b from-black via-black/90 to-black/70 to-90% bg-clip-text text-center text-4xl font-bold text-transparent md:text-5xl md:leading-[64px] dark:from-white dark:via-white/90 dark:to-white/70'>
          {post.title}
        </h1>
        <div className='grid grid-cols-2 text-sm max-md:gap-4 md:grid-cols-4'>
          <div className='space-y-1 md:mx-auto'>
            <div className='text-muted-foreground'>{t('blog.header.written-by')}</div>
            <Link href='https://github.com/nelsonlaidev' className='flex items-center gap-2'>
              <BlurImage
                src='/images/avatar.png'
                className='rounded-full'
                width={24}
                height={24}
                alt='Nelson Lai'
              />
              Nelson Lai
            </Link>
          </div>
          <div className='space-y-1 md:mx-auto'>
            <div className='text-muted-foreground'>{t('blog.header.published-on')}</div>
            <div>{formattedDate}</div>
          </div>
          <div className='space-y-1 md:mx-auto'>
            <div className='text-muted-foreground'>{t('blog.header.views')}</div>
            {viewCountQuery.status === 'pending' && '--'}
            {viewCountQuery.status === 'error' && t('common.error')}
            {viewCountQuery.status === 'success' && (
              <NumberFlow value={viewCountQuery.data.views} data-testid='view-count' />
            )}
          </div>
          <div className='space-y-1 md:mx-auto'>
            <div className='text-muted-foreground'>{t('blog.header.comments')}</div>
            {commentCountQuery.status === 'pending' && '--'}
            {commentCountQuery.status === 'error' && t('common.error')}
            {commentCountQuery.status === 'success' && (
              <NumberFlow value={commentCountQuery.data.count} data-testid='comment-count' />
            )}
          </div>
        </div>
      </div>
      <ImageZoom
        zoomImg={{
          src: `/images/blog/${post.slug}/cover.png`,
          alt: post.title
        }}
      >
        <BlurImage
          src={`/images/blog/${post.slug}/cover.png`}
          className='rounded-lg'
          width={1200}
          height={630}
          lazy={false}
          alt={post.title}
        />
      </ImageZoom>
    </div>
  )
}

export default Header
