import { Link } from 'react-router'

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Card, CardContent } from '~/components/ui/card'
import PATH from '~/constants/path'
import usePublicProducts from '~/hooks/use-public-products'
import { formatCurrency } from '~/lib/utils'

export default function HomePage() {
  const { products } = usePublicProducts()

  return (
    <div className='space-y-4'>
      <h2 className='font-semibold text-xl tracking-tight'>Top deal - sale rẻ</h2>
      <div className='grid grid-cols-12 gap-4'>
        {products.map((product) => (
          <div className='col-span-2'>
            <Card key={product._id} className='py-2'>
              <CardContent className='px-2'>
                <div className='space-y-4'>
                  <Link to={PATH.PRODUCT_DETAIL({ name: product.name, id: product._id })} className='block'>
                    <img src={product.thumbnail.url} alt={product.name} className='rounded-xl' />
                  </Link>
                  <div className='space-y-1'>
                    <Link
                      to={PATH.PRODUCT_DETAIL({ name: product.name, id: product._id })}
                      className='text-sm hover:underline line-clamp-1'
                    >
                      {product.name}
                    </Link>
                    <div className='flex justify-between items-center space-x-4'>
                      <div className='flex space-y-1 flex-col'>
                        <div className='font-semibold text-sm'>{formatCurrency(product.price)}&#8363;</div>
                        <div className='text-muted-foreground text-xs line-through'>
                          {formatCurrency(product.priceAfterDiscount)}&#8363;
                        </div>
                      </div>
                      <div className='text-xs font-semibold bg-red-500 rounded-sm p-1 text-white'>-20%</div>
                    </div>
                  </div>
                  <div>
                    <Link to={PATH.HOME} className='flex items-center space-x-2'>
                      <Avatar className='size-6'>
                        <AvatarImage src={product.author.avatar} alt={product.author.fullName} />
                        <AvatarFallback>
                          {product.author.fullName[0].toUpperCase()}
                          {product.author.fullName[1].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className='text-sm text-muted-foreground'>{product.author.fullName}</div>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}
