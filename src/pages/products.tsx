import { Loader2 } from 'lucide-react'
import React from 'react'
import { createSearchParams, useLocation, useNavigate, useSearchParams } from 'react-router'

import PaginationV2 from '~/components/pagination'
import ProductItem from '~/components/product-item'
import { Button } from '~/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Checkbox } from '~/components/ui/checkbox'
import { Label } from '~/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import useProductCategories from '~/hooks/use-product-categories'
import usePublicProducts from '~/hooks/use-public-products'

const LIMIT_CATEGORIES = 5

export default function ProductsPage() {
  const location = useLocation()
  const navigate = useNavigate()

  const [searchParams, setSearchParams] = useSearchParams()
  const queryParams = React.useMemo(() => Object.fromEntries([...searchParams]), [searchParams])
  const page = queryParams.page
  const sortBy = queryParams.sortBy
  const orderBy = queryParams.orderBy as 'asc' | 'desc'
  const categoryIds = queryParams.categoryIds

  const { products, totalProducts, pagination, getProductsQuery } = usePublicProducts({
    page,
    sortBy,
    orderBy,
    categoryIds
  })

  const [filterCategoryIds, setFilterCategoryIds] = React.useState<string[]>(queryParams.categoryIds?.split('-') || [])
  const [isSeeMoreCategories, setIsSeeMoreCategories] = React.useState<boolean>(false)

  const handleRemoveCategoryIds = React.useCallback(() => {
    // Giữ lại tất cả params trừ categoryIds
    const newParams = new URLSearchParams()
    // Thêm lại tất cả params ngoại trừ categoryIds
    searchParams.forEach((value, key) => {
      if (key !== 'categoryIds') {
        newParams.append(key, value)
      }
    })
    setSearchParams(newParams)
  }, [searchParams, setSearchParams])

  // Cập nhật query params khi categoryIds có thay đổi
  React.useEffect(() => {
    const filterCategoryIdsToString = filterCategoryIds.join('-')
    if (filterCategoryIdsToString.trim()) {
      navigate({
        pathname: location.pathname,
        search: createSearchParams({
          ...queryParams,
          categoryIds: filterCategoryIdsToString
        }).toString()
      })
    } else {
      handleRemoveCategoryIds()
    }
  }, [filterCategoryIds, location.pathname, queryParams, navigate, handleRemoveCategoryIds])

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

  const handleResetFilter = () => {
    setFilterCategoryIds([])
  }

  const { productCategories, totalProductCategories } = useProductCategories({})

  return (
    <div className='flex items-start space-x-4'>
      {/* Bộ lọc */}
      <Card className='basis-1/5'>
        <CardHeader>
          <CardTitle className='text-xl'>Bộ lọc</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-8'>
            {/* Lọc theo danh mục sản phẩm */}
            <div className='space-y-6'>
              <Label>Danh mục</Label>
              <div className='space-y-4'>
                {productCategories
                  .slice(0, !isSeeMoreCategories ? LIMIT_CATEGORIES : undefined)
                  .map((productCategory) => (
                    <div key={productCategory._id} className='flex items-center space-x-2'>
                      <Checkbox
                        id={productCategory._id}
                        name='categoryId'
                        checked={filterCategoryIds.includes(productCategory._id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFilterCategoryIds((prevState) => [...prevState, productCategory._id])
                          } else {
                            setFilterCategoryIds((prevState) =>
                              prevState.filter((filterCategoryId) => filterCategoryId !== productCategory._id)
                            )
                          }
                        }}
                      />
                      <Label htmlFor={productCategory._id}>{productCategory.name}</Label>
                    </div>
                  ))}
                {totalProductCategories > LIMIT_CATEGORIES && (
                  <div className='flex justify-end'>
                    <Button
                      variant='link'
                      size='sm'
                      className='p-0'
                      onClick={() => setIsSeeMoreCategories((prevState) => !prevState)}
                    >
                      {!isSeeMoreCategories ? 'Xem thêm' : 'Ẩn bớt'}
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <Button className='w-full' onClick={handleResetFilter}>
              Xóa bộ lọc
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* Danh sách sản phẩm */}
      <Card className='flex-1'>
        <CardHeader>
          <CardTitle className='text-xl'>Danh sách sản phẩm</CardTitle>
          <CardDescription>Có {totalProducts} sản phẩm trên hệ thống</CardDescription>
          {/* Sắp xếp */}
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
