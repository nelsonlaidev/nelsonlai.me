'use client'

import { useTranslations } from 'next-intl'

import AdminPageHeader from '@/components/admin/admin-page-header'
import CommentsTable from '@/components/tables/comments'
import { useAdminComments } from '@/hooks/queries/admin.query'

const Page = () => {
  const { isSuccess, isLoading, isError, data } = useAdminComments()
  const t = useTranslations()

  return (
    <div className='space-y-6'>
      <AdminPageHeader
        title={t('admin.page-header.comments.title')}
        description={t('admin.page-header.comments.description')}
      />
      {isSuccess && <CommentsTable comments={data.comments} />}
      {isLoading && 'Loading...'}
      {isError && <div>{t('error.failed-to-fetch-comments-data')}</div>}
    </div>
  )
}

export default Page
