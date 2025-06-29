import { Loader2 } from 'lucide-react'
import { Link } from 'react-router'

import ProductItem from '~/components/product-item'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '~/components/ui/carousel'
import PATH from '~/constants/path'
import useProductCategories from '~/hooks/use-product-categories'
import usePublicProducts from '~/hooks/use-public-products'

const CAROUSELS = [
  'https://salt.tikicdn.com/cache/w750/ts/tikimsp/5d/fe/03/7376add6ce8630bb1845b3df5dc160e7.png.webp',
  'https://salt.tikicdn.com/cache/w750/ts/tikimsp/bd/4b/60/71027fa57273256ee0946f61c570a499.png.webp',
  'https://salt.tikicdn.com/cache/w750/ts/tikimsp/fd/56/59/721b7b9d62ea58ec0f7d1de075a36e66.png.webp',
  'https://salt.tikicdn.com/cache/w750/ts/tikimsp/32/fa/30/36d8ec5a6f2f5696146141a3e0dbf782.png.webp'
] as const

export default function HomePage() {
  const { products, totalProducts, getProductsQuery } = usePublicProducts({
    limit: '5'
  })

  const { productCategories } = useProductCategories({})

  return (
    <div className='space-y-4'>
      {/* Carousel */}
      <Carousel>
        <CarouselContent>
          {CAROUSELS.map((carousel) => (
            <CarouselItem key={carousel} className='basis-1/2'>
              <img src={carousel} alt={carousel} className='rounded-md' />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className='left-1' />
        <CarouselNext className='right-1' />
      </Carousel>
      {/* Danh mục */}
      <Card>
        <CardHeader>
          <CardTitle className='text-xl'>Danh mục sản phẩm</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-10 gap-4'>
            {productCategories.slice(0, 10).map((productCategory) => (
              <div key={productCategory._id} className='col-span-1'>
                <Link
                  to={PATH.HOME}
                  className='flex flex-col items-center space-y-2 p-2 rounded-md transition hover:bg-muted'
                >
                  <img
                    src={productCategory.thumbnail}
                    alt={productCategory.name}
                    className='size-10 aspect-square rounded-md object-cover'
                  />
                  <div className='text-sm font-medium text-center'>{productCategory.name}</div>
                </Link>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      {/* Top deal - sale rẻ */}
      <Card>
        <CardHeader>
          <CardTitle className='text-xl'>Top deal - sale rẻ</CardTitle>
        </CardHeader>
        <CardContent>
          {totalProducts > 0 && !getProductsQuery.isLoading && (
            <div className='grid grid-cols-10 gap-4'>
              {products.map((product) => (
                <div key={product._id} className='col-span-2'>
                  <ProductItem productData={product} />
                </div>
              ))}
            </div>
          )}
          {getProductsQuery.isLoading && (
            <div className='flex justify-center items-center p-10'>
              <Loader2 className='size-10 animate-spin' />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
