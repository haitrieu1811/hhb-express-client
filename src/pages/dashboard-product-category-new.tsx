import React from 'react'

import BackButton from '~/components/back-button'
import CreateProductCategoryForm from '~/components/create-product-category-form'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

export default function DashboardProductCategoryNewPage() {
  return (
    <React.Fragment>
      <div>
        <BackButton />
      </div>
      <Card>
        <CardHeader>
          <CardTitle className='text-xl'>Tạo danh mục sản phẩm mới</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateProductCategoryForm />
        </CardContent>
      </Card>
    </React.Fragment>
  )
}
