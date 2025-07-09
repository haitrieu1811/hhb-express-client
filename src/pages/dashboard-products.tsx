import { Check, Pause, PlusCircle } from 'lucide-react'
import { Link } from 'react-router'

import { productColumns } from '~/components/columns/product'
import { DataTable } from '~/components/data-table'
import { Button } from '~/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { ProductStatus } from '~/constants/enum'
import PATH from '~/constants/path'
import useProductCategories from '~/hooks/use-product-categories'
import usePublicProducts from '~/hooks/use-public-products'

export default function DashboardProductsPage() {
  const { products, totalProducts } = usePublicProducts({})
  const { productCategories } = useProductCategories({})
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-xl'>Danh sách sản phẩm</CardTitle>
        <CardDescription>Có {totalProducts} sản phẩm.</CardDescription>
        <CardAction>
          <Button asChild variant='outline'>
            <Link to={PATH.DASHBOARD_PRODUCT_NEW}>
              <PlusCircle />
              Thêm sản phẩm mới
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={productColumns}
          data={products}
          searchField='name'
          facetedFilters={[
            {
              title: 'Trạng thái',
              columnName: 'status',
              options: [
                {
                  value: ProductStatus.Active.toString(),
                  label: 'Hoạt động',
                  icon: Check
                },
                {
                  value: ProductStatus.Inactive.toString(),
                  label: 'Tạm dừng',
                  icon: Pause
                }
              ]
            },
            {
              title: 'Danh mục',
              columnName: 'categoryId',
              options: productCategories.map((category) => ({
                label: category.name,
                value: category._id
              }))
            }
          ]}
        />
      </CardContent>
    </Card>
  )
}
