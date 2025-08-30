/**
 * Inspired by: https://jahir.dev/uses
 */
import BlurImage from '@/components/blur-image'

import Link from '../link'

type Items = Array<{
  image: string
  name: string
  description: string
  url: string
}>

type ItemGridProps = {
  items: Items
}

const ItemGrid = (props: ItemGridProps) => {
  const { items } = props

  return (
    <div className='mb-9 grid grid-cols-1 gap-4 sm:grid-cols-4'>
      {items.map((item) => (
        <Link
          key={item.name}
          href={item.url}
          className='flex gap-6 rounded-lg border p-4 no-underline shadow-xs transition-colors hover:bg-zinc-100 sm:flex-col sm:gap-3 dark:bg-zinc-900 dark:hover:bg-zinc-800'
        >
          <BlurImage
            src={item.image}
            width={256}
            height={256}
            alt={item.name}
            className='shrink-0'
            imageClassName='m-0 size-24 sm:size-full'
          />
          <div className='flex flex-col justify-center gap-2'>
            <div className='text-lg font-extrabold'>{item.name}</div>
            <div className='text-sm text-muted-foreground'>{item.description}</div>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default ItemGrid
