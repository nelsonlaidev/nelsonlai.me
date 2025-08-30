import { AspectRatio } from '@repo/ui/components/aspect-ratio'
import { cn } from '@repo/utils'

type VideoProps = {
  src: string
  width: number
  height: number
} & React.ComponentProps<'video'>

const Video = (props: VideoProps) => {
  const { src, width, height, controls = true, className, ...rest } = props

  return (
    <AspectRatio ratio={16 / 9}>
      <video
        className={cn('my-4 rounded-lg shadow-lg', className)}
        loop={true}
        muted={true}
        src={src}
        controls={controls}
        width={width}
        height={height}
        {...rest}
      />
    </AspectRatio>
  )
}

export default Video
