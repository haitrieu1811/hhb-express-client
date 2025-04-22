import { useQuery } from '@tanstack/react-query'
import { PlusCircle } from 'lucide-react'
import React from 'react'

import productCategoriesApis from '~/apis/productCategories.apis'
import { ProductCategoryColumns } from '~/components/columns/product-category'
import CreateProductCategoryForm from '~/components/create-product-category-form'
import { DataTable } from '~/components/data-table'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { ProductCategoryStatus } from '~/constants/enum'

export default function DashboardProductCategoryPage() {
  const [isOpenCreateDialog, setIsOpenCreateDialog] = React.useState<boolean>(false)

  const getProductCategoriesQuery = useQuery({
    queryKey: ['get-product-categories'],
    queryFn: () => productCategoriesApis.getProductCategories()
  })

  const productCategories = React.useMemo(
    () => getProductCategoriesQuery.data?.data.data.productCategories ?? [],
    [getProductCategoriesQuery.data?.data.data.productCategories]
  )

  const totalProductCategories = React.useMemo(
    () => getProductCategoriesQuery.data?.data.data.pagination.totalRows ?? 0,
    [getProductCategoriesQuery.data?.data.data.pagination.totalRows]
  )

  return (
    <div className='gap-4 grid'>
      <div className='flex justify-end'>
        <Button size='sm' variant='outline' onClick={() => setIsOpenCreateDialog(true)}>
          <PlusCircle className='w-4 h-4 mr-1' />
          Thêm danh mục sản phẩm mới
        </Button>
        <Dialog open={isOpenCreateDialog} onOpenChange={(value) => setIsOpenCreateDialog(value)}>
          <DialogContent className='max-h-screen overflow-y-auto'>
            <DialogHeader className='mb-4'>
              <DialogTitle>Thêm danh mục sản phẩm mới</DialogTitle>
            </DialogHeader>
            <CreateProductCategoryForm onSuccess={() => setIsOpenCreateDialog(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className='text-xl'>Danh sách danh mục sản phẩm</CardTitle>
          <CardDescription>Có {totalProductCategories} danh mục sản phẩm trên hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={ProductCategoryColumns}
            data={productCategories}
            searchField='name'
            facetedFilters={[
              {
                title: 'Trạng thái',
                columnName: 'status',
                options: [
                  {
                    value: ProductCategoryStatus.Active.toString(),
                    label: 'Hoạt động'
                  },
                  {
                    value: ProductCategoryStatus.Inactive.toString(),
                    label: 'Ngừng hoạt động'
                  }
                ]
              }
            ]}
          />
        </CardContent>
      </Card>
    </div>
  )
}
