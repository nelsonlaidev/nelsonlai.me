/**
 * Inspired by: https://fig.io
 */
'use client'

import { SiGithub, SiWakatime, SiYoutube } from '@icons-pack/react-simple-icons'
import { useTranslations } from '@repo/i18n/client'
import { ArrowRightIcon, PencilIcon, StarIcon } from 'lucide-react'

import Counter from '@/components/counter'
import Link from '@/components/link'
import {
  useBlogLikeStat,
  useBlogViewStat,
  useGitHubStat,
  useWakatimeStat,
  useYouTubeStat
} from '@/hooks/queries/stat.query'

type Card = {
  icon: React.ReactNode
  title: string
  link: string
  value: number | undefined
  linkText: string
  gradient: {
    startColor: string
    endColor: string
  }
  suffix?: string
}

const Stats = () => {
  const youtubeQuery = useYouTubeStat()
  const githubQuery = useGitHubStat()
  const likesQuery = useBlogLikeStat()
  const viewsQuery = useBlogViewStat()
  const wakatimeQuery = useWakatimeStat()

  const t = useTranslations()

  const data: Card[] = [
    {
      title: t('dashboard.stat.coding-hours'),
      link: 'https://wakatime.com/@nelsonlaidev',
      value: wakatimeQuery.data?.hours,
      icon: <SiWakatime className='text-[#0061ff]' />,
      linkText: 'WakaTime',
      gradient: {
        startColor: '#0061ff',
        endColor: '#6f7bf7'
      },
      suffix: 'hrs'
    },
    {
      title: t('dashboard.stat.youtube-subscribers'),
      link: 'https://www.youtube.com/@nelsonlaidev',
      value: youtubeQuery.data?.subscribers,
      icon: <SiYoutube className='text-[#ff0000]' />,
      linkText: 'YouTube',
      gradient: {
        startColor: '#ff0000',
        endColor: '#ca1a1a'
      }
    },
    {
      title: t('dashboard.stat.youtube-views'),
      link: 'https://www.youtube.com/@nelsonlaidev',
      value: youtubeQuery.data?.views,
      icon: <SiYoutube className='text-[#ff0000]' />,
      linkText: 'YouTube',
      gradient: {
        startColor: '#ff0000',
        endColor: '#ca1a1a'
      }
    },
    {
      title: t('dashboard.stat.github-followers'),
      link: 'https://github.com/nelsonlaidev',
      value: githubQuery.data?.followers,
      icon: <SiGithub className='text-[#fee000]' />,
      linkText: 'GitHub',
      gradient: {
        startColor: '#fee000',
        endColor: '#ffce63'
      }
    },
    {
      title: t('dashboard.stat.github-stars'),
      link: 'https://github.com/nelsonlaidev',
      value: githubQuery.data?.stars,
      icon: <StarIcon className='size-6 text-[#fee000]' />,
      linkText: 'GitHub',
      gradient: {
        startColor: '#fee000',
        endColor: '#ffce63'
      }
    },
    {
      title: t('dashboard.stat.blog-total-views'),
      link: 'https://nelsonlai.me',
      value: viewsQuery.data?.views,
      icon: <PencilIcon className='size-6 text-[#ff0f7b]' />,
      linkText: 'Blog',
      gradient: {
        startColor: '#ff0f7b',
        endColor: '#f945ff'
      }
    },
    {
      title: t('dashboard.stat.blog-total-likes'),
      link: 'https://nelsonlai.me',
      value: likesQuery.data?.likes,
      icon: <PencilIcon className='size-6 text-[#ff0f7b]' />,
      linkText: 'Blog',
      gradient: {
        startColor: '#ff0f7b',
        endColor: '#f945ff'
      }
    }
  ]

  return (
    <div className='mb-4 mt-16 grid gap-4 sm:grid-cols-2 md:grid-cols-3'>
      {data.map((stat) => {
        const {
          icon,
          link,
          title,
          value,
          linkText,
          gradient: { startColor, endColor },
          suffix
        } = stat

        const hasValue = value === 0 || value !== undefined

        return (
          <Link
            key={stat.title}
            href={link}
            className='shadow-xs group relative overflow-hidden rounded-lg border p-4 transition-colors hover:bg-zinc-100 dark:bg-zinc-900/50 dark:hover:bg-zinc-900'
          >
            <div className='flex flex-col items-center justify-center gap-2 transition-transform group-hover:-translate-y-24 group-focus:-translate-y-24'>
              <div className='flex items-center gap-2 text-3xl font-semibold'>
                {hasValue ? (
                  <>
                    <span>{icon}</span>
                    <div
                      style={{
                        background: `linear-gradient(122.25deg, ${startColor} 12.16%, ${endColor} 70.98%)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}
                    >
                      <Counter value={value} />
                      {suffix && <span>{` ${suffix}`}</span>}
                    </div>
                  </>
                ) : (
                  '--'
                )}
              </div>
              <div className='text-xl font-medium'>{title}</div>
            </div>
            <span className='absolute left-1/2 top-1/2 flex -translate-x-1/2 translate-y-24 items-center gap-1 text-2xl font-semibold opacity-0 transition group-hover:-translate-y-1/2 group-hover:opacity-100 group-focus:-translate-y-1/2 group-focus:opacity-100'>
              {linkText}
              <ArrowRightIcon className='size-6' />
            </span>
          </Link>
        )
      })}
    </div>
  )
}

export default Stats
