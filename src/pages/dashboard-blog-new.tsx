import React from 'react'

import CreateBlogForm from '~/components/forms/create-blog'

export default function DashboardBlogNewPage() {
  return (
    <React.Fragment>
      <h1 className='text-xl font-semibold tracking-tight'>Thêm blog mới</h1>
      <CreateBlogForm />
    </React.Fragment>
  )
}
