import { ChevronLeft } from 'lucide-react'
import React from 'react'
import { useNavigate, useParams } from 'react-router'

import CreateBlogForm from '~/components/forms/create-blog'
import { Button } from '~/components/ui/button'
import useBlog from '~/hooks/use-blog'

export default function DashboardBlogDetailPage() {
  const navigate = useNavigate()

  const params = useParams()
  const blogId = params.blogId

  const { blog, getBlogQuery } = useBlog({
    blogId
  })

  return (
    <React.Fragment>
      <div className='flex items-center space-x-4'>
        <Button size='icon' variant='outline' onClick={() => navigate(-1)}>
          <ChevronLeft className='size-4' />
        </Button>
        <h1 className='text-xl font-semibold tracking-tight'>Cập nhật bài viết</h1>
      </div>
      <CreateBlogForm
        blogData={blog}
        onUpdateSuccess={() => {
          getBlogQuery.refetch()
        }}
      />
    </React.Fragment>
  )
}
