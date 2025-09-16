import { cn } from '@repo/utils'
import { useId } from 'react'

type GradientBackgroundProps = React.ComponentProps<'svg'>

const Filter = (props: React.ComponentProps<'filter'>) => (
  <filter colorInterpolationFilters='sRGB' filterUnits='userSpaceOnUse' {...props}>
    <feFlood floodOpacity='0' result='BackgroundImageFix' />
    <feBlend in='SourceGraphic' in2='BackgroundImageFix' result='shape' />
    <feGaussianBlur result='gradient-background-blur' stdDeviation='118.081' />
  </filter>
)

const GradientBackground = (props: GradientBackgroundProps) => {
  const { className, ...rest } = props

  const id = useId()
  const orange = `orange-${id}`
  const red = `red-${id}`
  const blue = `blue-${id}`

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='100%'
      fill='none'
      viewBox='0 0 1440 550'
      preserveAspectRatio='xMidYMid meet'
      className={cn('max-w-300', className)}
      {...rest}
    >
      <g filter={`url(#${orange})`}>
        <ellipse cx='898.121' cy='7.207' fill='#FFB800' fillOpacity='.43' rx='284.881' ry='69.058' />
      </g>
      <g filter={`url(#${red})`}>
        <ellipse cx='727.789' cy='48.819' fill='#E93F3F' fillOpacity='.43' rx='284.881' ry='131.671' />
      </g>
      <g filter={`url(#${blue})`}>
        <ellipse cx='504.666' cy='27.364' fill='#3F64E9' fillOpacity='.43' rx='284.881' ry='89.316' />
      </g>
      <defs>
        <Filter id={orange} width='1042.08' height='610.439' x='377.079' y='-298.012' />
        <Filter id={red} width='1042.08' height='735.665' x='206.747' y='-319.013' />
        <Filter id={blue} width='1042.08' height='650.953' x='-16.376' y='-298.113' />
      </defs>
    </svg>
  )
}

export default GradientBackground
