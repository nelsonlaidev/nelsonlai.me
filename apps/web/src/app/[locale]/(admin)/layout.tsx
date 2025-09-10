import { redirect } from '@repo/i18n/routing'
import { SidebarProvider } from '@repo/ui/components/sidebar'

import AdminHeader from '@/components/admin/admin-header'
import AdminSidebar from '@/components/admin/admin-sidebar'
import { getSession } from '@/lib/auth'

const Layout = async (props: LayoutProps<'/[locale]'>) => {
  const { children, params } = props
  const { locale } = await params
  const session = await getSession()

  if (!session || session.user.role !== 'admin') {
    redirect({
      href: '/',
      locale
    })
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <div className='flex w-full flex-col overflow-x-hidden px-4'>
        <AdminHeader />
        <main className='py-6'>{children}</main>
      </div>
    </SidebarProvider>
  )
}

export default Layout
