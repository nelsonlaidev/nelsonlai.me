'use client'

import type { Project } from 'content-collections'

import BlurImage from '@/components/blur-image'

import Link from './link'

type ProjectCardProps = Project
type ProjectCardsProps = {
  projects: Project[]
}

const ProjectCards = (props: ProjectCardsProps) => {
  const { projects } = props

  return (
    <div className='grid gap-4 md:grid-cols-2'>
      {projects.map((project) => (
        <ProjectCard key={project.slug} {...project} />
      ))}
    </div>
  )
}

const ProjectCard = (props: ProjectCardProps) => {
  const { name, description, techstack, slug } = props

  return (
    <Link href={`/projects/${slug}`} className='shadow-feature-card group rounded-xl px-2 py-4'>
      <BlurImage
        src={`/images/projects/${slug}/cover.png`}
        width={1280}
        height={832}
        imageClassName='group-hover:scale-105'
        alt={name}
        className='rounded-lg'
      />
      <div className='flex-1 px-2 py-4'>
        <div className='space-y-2'>
          <h2 className='text-2xl font-semibold'>{name}</h2>
          <div className='text-muted-foreground'>{description}</div>
        </div>
        <div className='mt-4 flex flex-wrap gap-2'>
          {techstack.map((label) => {
            return (
              <div key={label} className='rounded-full border bg-zinc-50 px-3 py-2 text-xs leading-4 dark:bg-zinc-900'>
                {label}
              </div>
            )
          })}
        </div>
      </div>
    </Link>
  )
}

export default ProjectCards
