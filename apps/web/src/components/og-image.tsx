import { Logo } from '@repo/ui/components/logo'

const getFontSize = (title: string) => {
  const baseSize = 80
  const minSize = 50
  const maxChars = 80

  if (title.length <= 30) return baseSize

  if (title.length >= maxChars) return minSize

  const scale = 1 - (title.length - 20) / (maxChars - 20)
  return Math.round(minSize + (baseSize - minSize) * scale)
}

type OGImageProps = {
  title: string
  url?: string
}

const OGImage = (props: OGImageProps) => {
  const { title, url } = props
  const fontSize = getFontSize(title)

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: '#000',
        padding: 50,
        color: '#fff'
      }}
    >
      <Logo width={50} style={{ position: 'absolute', left: 50, top: 50 }} />
      <div style={{ fontSize, maxWidth: 740, fontWeight: 600 }}>{title}</div>
      <div style={{ display: 'flex', fontSize: 30, position: 'absolute', right: 50, bottom: 50, fontWeight: 500 }}>
        nelsonlai.dev{url}
      </div>
    </div>
  )
}

export default OGImage
