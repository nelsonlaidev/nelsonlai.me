import MainLayout from '@/components/main-layout'

const Layout = (props: LayoutProps<'/[locale]'>) => {
  const { children } = props

  return <MainLayout>{children}</MainLayout>
}

export default Layout
