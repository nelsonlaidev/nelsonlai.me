import type { SidebarGroup as SidebarGroupConfig } from '@/config/admin-sidebar-links'

import { useTranslations } from '@repo/i18n/client'
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu } from '@repo/ui/components/sidebar'

import AdminNavLink from './admin-nav-link'

type AdminNavGroupProps = SidebarGroupConfig

const AdminNavGroup = (props: AdminNavGroupProps) => {
  const { titleKey, links } = props
  const t = useTranslations()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t(`admin.nav.${titleKey}`)}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {links.map((link) => (
            <AdminNavLink key={link.titleKey} {...link} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

export default AdminNavGroup
