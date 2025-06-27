import { Loader2 } from 'lucide-react'
import { createSearchParams, useLocation, useNavigate, useSearchParams } from 'react-router'

import PaginationV2 from '~/components/pagination'
import ProductItem from '~/components/product-item'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import usePublicProducts from '~/hooks/use-public-products'

export default function ProductsPage() {
  const [searchParams] = useSearchParams()
  const queryParams = Object.fromEntries([...searchParams])

  const location = useLocation()
  const navigate = useNavigate()

  const page = queryParams.page
  const sortBy = queryParams.sortBy
  const orderBy = queryParams.orderBy as 'asc' | 'desc'

  const { products, totalProducts, pagination, getProductsQuery } = usePublicProducts({
    page,
    sortBy,
    orderBy
  })

  const handleSort = (value: string) => {
    const sortBy = value.split('-')[0]
    const orderBy = value.split('-')[1]
    navigate({
      pathname: location.pathname,
      search: createSearchParams({
        ...queryParams,
        sortBy,
        orderBy
      }).toString()
    })
  }

  return (
    <div className='flex items-start space-x-4'>
      {/* Bộ lọc */}
      <Card className='basis-1/5'>
        <CardHeader>
          <CardTitle className='text-xl'>Bộ lọc</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-12 gap-4'></div>
        </CardContent>
      </Card>
      {/* Danh sách sản phẩm */}
      <Card className='flex-1'>
        <CardHeader>
          <CardTitle className='text-xl'>Danh sách sản phẩm</CardTitle>
          <CardDescription>Có {totalProducts} sản phẩm trên hệ thống</CardDescription>
          <CardAction>
            <Select onValueChange={handleSort}>
              <SelectTrigger className='w-[200px]'>
                <SelectValue placeholder='Sắp xếp theo' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='priceAfterDiscount-asc'>Giá tăng dần</SelectItem>
                <SelectItem value='priceAfterDiscount-desc'>Giá giảm dần</SelectItem>
                <SelectItem value='name-asc'>Tên từ A - Z</SelectItem>
                <SelectItem value='name-desc'>Tên từ Z - A</SelectItem>
              </SelectContent>
            </Select>
          </CardAction>
        </CardHeader>
        <CardContent className='space-y-8'>
          {/* Danh sách sản phẩm */}
          {!getProductsQuery.isLoading && !getProductsQuery.isFetching && (
            <div className='grid grid-cols-12 gap-4'>
              {products.map((product) => (
                <div key={product._id} className='col-span-3'>
                  <ProductItem productData={product} />
                </div>
              ))}
            </div>
          )}
          {/* Loading */}
          {getProductsQuery.isFetching && (
            <div className='flex justify-center items-center p-10'>
              <Loader2 className='size-10 animate-spin stroke-1 stroke-primary' />
            </div>
          )}
          {/* Phân trang */}
          {pagination.totalPages > 1 && <PaginationV2 totalPages={pagination.totalPages} />}
        </CardContent>
      </Card>
    </div>
  )
}
