import { ChevronLeft } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router'

import CreateBlogForm from '~/components/forms/create-blog'
import { Button } from '~/components/ui/button'

export default function DashboardBlogNewPage() {
  const navigate = useNavigate()
  return (
    <React.Fragment>
      <div className='flex items-center space-x-4'>
        <Button size='icon' variant='outline' onClick={() => navigate(-1)}>
          <ChevronLeft className='size-4' />
        </Button>
        <h1 className='text-xl font-semibold tracking-tight'>Thêm bài viết mới</h1>
      </div>
      <CreateBlogForm />
    </React.Fragment>
  )
}
