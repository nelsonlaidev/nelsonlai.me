'use client'

import { DataTableSkeleton } from '@repo/ui/components/data-table'
import { useTranslations } from 'next-intl'

import AdminPageHeader from '@/components/admin/admin-page-header'
import CommentsTable from '@/components/admin/comments-table'
import { useAdminComments } from '@/hooks/queries/admin.query'
import { useAdminCommentsParams } from '@/hooks/use-admin-comments-params'

const Page = () => {
  const [params] = useAdminCommentsParams()
  const { isSuccess, isLoading, isError, data } = useAdminComments(params)
  const t = useTranslations()

  return (
    <div className='space-y-6'>
      <AdminPageHeader
        title={t('admin.page-header.comments.title')}
        description={t('admin.page-header.comments.description')}
      />
      {isSuccess && <CommentsTable data={data.comments} pageCount={data.pageCount} typeCounts={data.typeCounts} />}
      {isLoading && <DataTableSkeleton columnCount={4} rowCount={10} filterCount={3} />}
      {isError && <div>{t('error.failed-to-fetch-comments-data')}</div>}
    </div>
  )
}

export default Page
