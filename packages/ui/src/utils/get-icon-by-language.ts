import { SiCss, SiHtml5, SiJavascript, SiMarkdown, SiMdx, SiReact, SiTypescript } from '@icons-pack/react-simple-icons'
import { FileIcon, TerminalIcon } from 'lucide-react'

type Icon = {
  language: string[]

  icon: React.FC<React.SVGProps<SVGSVGElement>>
}

const icons: Icon[] = [
  {
    language: ['javascript', 'js', 'mjs', 'cjs'],
    icon: SiJavascript
  },
  {
    language: ['typescript', 'ts', 'mts', 'cts'],
    icon: SiTypescript
  },
  {
    language: ['html'],
    icon: SiHtml5
  },
  {
    language: ['css'],
    icon: SiCss
  },
  {
    language: ['jsx', 'tsx'],
    icon: SiReact
  },
  {
    language: ['sh', 'bash', 'zsh'],
    icon: TerminalIcon
  },
  {
    language: ['markdown', 'md'],
    icon: SiMarkdown
  },
  {
    language: ['mdx'],
    icon: SiMdx
  }
]

const languageToIcon = new Map<string, React.FC<React.SVGProps<SVGSVGElement>>>()

for (const icon of icons) {
  for (const language of icon.language) {
    languageToIcon.set(language, icon.icon)
  }
}

export const getIconByLanguage = (language: string): React.FC<React.SVGProps<SVGSVGElement>> => {
  return languageToIcon.get(language) ?? FileIcon
}
