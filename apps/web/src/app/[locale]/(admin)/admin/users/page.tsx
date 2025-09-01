'use client'

import { useTranslations } from 'next-intl'

import AdminPageHeader from '@/components/admin/admin-page-header'
import UsersTable from '@/components/tables/users'
import { useAdminUsers } from '@/hooks/queries/admin.query'

const Page = () => {
  const { isSuccess, isLoading, isError, data } = useAdminUsers()
  const t = useTranslations()

  return (
    <div className='space-y-6'>
      <AdminPageHeader
        title={t('admin.page-header.users.title')}
        description={t('admin.page-header.users.description')}
      />
      {isSuccess && <UsersTable users={data.users} />}
      {isLoading && 'Loading...'}
      {isError && <div>{t('error.failed-to-fetch-users-data')}</div>}
    </div>
  )
}

export default Page
