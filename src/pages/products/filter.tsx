import { Star } from 'lucide-react'
import React from 'react'
import { createSearchParams, useLocation, useNavigate, useSearchParams } from 'react-router'

import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import { Label } from '~/components/ui/label'
import useProductCategories from '~/hooks/use-product-categories'
import useQueryParams from '~/hooks/use-query-params'
import { cn } from '~/lib/utils'

const LIMIT_CATEGORIES = 5

export default function ProductsFilter() {
  const location = useLocation()
  const navigate = useNavigate()

  const [searchParams, setSearchParams] = useSearchParams()
  const queryParams = useQueryParams()

  const minStarPoints = queryParams.minStarPoints
  const categoryIds = queryParams.categoryIds

  const [isSeeMoreCategories, setIsSeeMoreCategories] = React.useState<boolean>(false)
  const [currentCategoryIds, setCurrentCategoryIds] = React.useState<string[]>([])

  // Đặt giá trị mặc định cho currentCategoryIds
  React.useEffect(() => {
    if (!categoryIds) return
    setCurrentCategoryIds(categoryIds.split('-'))
  }, [categoryIds])

  // Chức năng lọc sản phẩm theo danh mục sẽ tự động thực hiện khi currentCategoryIds có sự thay đổi
  React.useEffect(() => {
    if (currentCategoryIds.length > 0) {
      navigate({
        pathname: location.pathname,
        search: createSearchParams({
          ...queryParams,
          categoryIds: currentCategoryIds.join('-')
        }).toString()
      })
      return
    }
    searchParams.delete('categoryIds')
    setSearchParams(searchParams)
  }, [currentCategoryIds, location.pathname, queryParams, searchParams, navigate, setSearchParams])

  const formRef = React.useRef<HTMLFormElement>(null)

  const { productCategories, totalProductCategories } = useProductCategories({})

  const handleResetFilter = () => {
    searchParams.delete('categoryIds')
    searchParams.delete('minStarPoints')
    setCurrentCategoryIds([])
    setSearchParams(searchParams)
    formRef.current?.reset()
  }

  return (
    <form ref={formRef}>
      <div className='space-y-6'>
        {/* Lọc theo danh mục sản phẩm */}
        <div className='space-y-6'>
          <Label>Danh mục</Label>
          <div className='space-y-4'>
            {productCategories.slice(0, !isSeeMoreCategories ? LIMIT_CATEGORIES : undefined).map((productCategory) => (
              <div key={productCategory._id} className='flex items-center space-x-2'>
                <Checkbox
                  id={productCategory._id}
                  name='categoryId'
                  checked={currentCategoryIds.includes(productCategory._id)}
                  onCheckedChange={(checked) => {
                    if (checked) setCurrentCategoryIds((prevState) => [...prevState, productCategory._id])
                    else setCurrentCategoryIds((prevState) => prevState.filter((item) => item !== productCategory._id))
                  }}
                />
                <Label htmlFor={productCategory._id}>{productCategory.name}</Label>
              </div>
            ))}
            {totalProductCategories > LIMIT_CATEGORIES && (
              <div className='flex justify-end'>
                <Button
                  type='button'
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
        {/* Lọc theo đánh giá */}
        <div className='space-y-6'>
          <Label>Đánh giá</Label>
          <div className='space-y-1'>
            {Array(5)
              .fill(0)
              .map((_, index) => {
                const starValue = 5 - index
                return (
                  <div key={index}>
                    <input
                      hidden
                      type='radio'
                      name='minStarPoints'
                      id={`minStarPoints-${starValue}`}
                      className='peer'
                      value={starValue}
                      onChange={(e) =>
                        navigate({
                          pathname: location.pathname,
                          search: createSearchParams({
                            ...queryParams,
                            minStarPoints: e.target.value
                          }).toString()
                        })
                      }
                    />
                    <label
                      htmlFor={`minStarPoints-${starValue}`}
                      className={cn(
                        'flex items-center space-x-1 p-2 rounded-md hover:cursor-pointer transition peer-checked:bg-muted',
                        {
                          'bg-muted': starValue.toString() === minStarPoints
                        }
                      )}
                    >
                      <div className='flex items-center space-x-px'>
                        {Array(5)
                          .fill(0)
                          .map((_, index) => (
                            <Star
                              key={index}
                              className={cn('size-4 stroke-yellow-500 dark:stroke-yellow-600', {
                                'fill-yellow-500 dark:fill-yellow-600': index < starValue
                              })}
                            />
                          ))}
                      </div>
                      {starValue !== 5 && <div className='text-sm font-medium'>trờ lên</div>}
                    </label>
                  </div>
                )
              })}
          </div>
        </div>
        <Button type='button' className='w-full' onClick={handleResetFilter}>
          Xóa bộ lọc
        </Button>
      </div>
    </form>
  )
}
