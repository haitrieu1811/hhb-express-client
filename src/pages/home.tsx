import { Loader2 } from 'lucide-react'

import ProductItem from '~/components/product-item'
import usePublicProducts from '~/hooks/use-public-products'

export default function HomePage() {
  const { products, totalProducts, getProductsQuery } = usePublicProducts({})
  return (
    <div className='space-y-6 py-10'>
      <h2 className='font-semibold text-xl tracking-tight'>Top deal - sale rẻ</h2>
      {totalProducts > 0 && !getProductsQuery.isLoading && (
        <div className='grid grid-cols-12 gap-4'>
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
    </div>
  )
}
