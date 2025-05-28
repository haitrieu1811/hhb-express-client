import React from 'react'

import CreateProductForm from '~/components/create-product-form'

export default function DashboardProductNewPage() {
  return (
    <React.Fragment>
      <h1 className='text-xl font-semibold tracking-tight'>Thêm sản phẩm mới</h1>
      <CreateProductForm />
    </React.Fragment>
  )
}
