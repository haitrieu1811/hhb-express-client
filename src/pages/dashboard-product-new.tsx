import { ChevronLeft } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router'

import CreateProductForm from '~/components/create-product-form'
import { Button } from '~/components/ui/button'

export default function DashboardProductNewPage() {
  const navigate = useNavigate()
  return (
    <React.Fragment>
      <div className='flex items-center space-x-4'>
        <Button size='icon' variant='outline' onClick={() => navigate(-1)}>
          <ChevronLeft />
        </Button>
        <h1 className='text-xl font-semibold tracking-tight'>Thêm sản phẩm mới</h1>
      </div>
      <CreateProductForm />
    </React.Fragment>
  )
}
