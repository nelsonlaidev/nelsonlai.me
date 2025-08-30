'use client'

import type { Post } from 'content-collections'

import { useTranslations } from '@repo/i18n/client'

import BlurImage from '@/components/blur-image'
import { usePostLikeCount, usePostViewCount } from '@/hooks/queries/post.query'
import { useFormattedDate } from '@/hooks/use-formatted-date'

import Link from './link'

type PostCardsProps = {
  posts: Post[]
}

type PostCardProps = Post

const PostCards = (props: PostCardsProps) => {
  const { posts } = props

  return (
    <div className='grid gap-4 md:grid-cols-2'>
      {posts.map((post) => (
        <PostCard key={post.slug} {...post} />
      ))}
    </div>
  )
}

const PostCard = (props: PostCardProps) => {
  const { slug, title, summary, date } = props
  const formattedDate = useFormattedDate(date)
  const t = useTranslations()

  const viewsQuery = usePostViewCount({ slug })
  const likesQuery = usePostLikeCount({ slug })

  return (
    <Link href={`/blog/${slug}`} className='group rounded-xl px-2 py-4 shadow-feature-card'>
      <BlurImage
        src={`/images/blog/${slug}/cover.png`}
        className='rounded-lg'
        width={1200}
        height={630}
        imageClassName='transition-transform group-hover:scale-105'
        alt={title}
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
      <div className='flex flex-col px-2 py-4'>
        <h3 className='text-2xl font-semibold'>{title}</h3>
        <p className='mt-2 text-muted-foreground'>{summary}</p>
      </div>
    </Link>
  )
}

export default PostCards
