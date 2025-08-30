'use client'

import { DataTableSkeleton } from '@repo/ui/components/data-table'
import { useTranslations } from 'next-intl'

import AdminPageHeader from '@/components/admin/admin-page-header'
import UsersTable from '@/components/admin/users-table'
import { useAdminUsers } from '@/hooks/queries/admin.query'
import { useAdminUsersParams } from '@/hooks/use-admin-users-params'

const Page = () => {
  const [params] = useAdminUsersParams()
  const { isSuccess, isLoading, isError, data } = useAdminUsers(params)
  const t = useTranslations()

  return (
    <div className='space-y-6'>
      <AdminPageHeader
        title={t('admin.page-header.users.title')}
        description={t('admin.page-header.users.description')}
      />
      {isSuccess && <UsersTable data={data.users} pageCount={data.pageCount} roleCounts={data.roleCounts} />}
      {isLoading && <DataTableSkeleton columnCount={4} rowCount={10} filterCount={3} />}
      {isError && <div>{t('error.failed-to-fetch-users-data')}</div>}
    </div>
  )
}

export default Page
