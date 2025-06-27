import { Loader2, Search, ShoppingCart } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router'

import PhotosGrid from '~/components/photos-grid'
import { AlertDialogHeader } from '~/components/ui/alert-dialog'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '~/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip'
import PATH from '~/constants/path'
import useCart from '~/hooks/use-cart'
import { formatCurrency, rateSale } from '~/lib/utils'
import { ProductItem as ProductItemType } from '~/types/products.types'

type ProductItemProps = {
  productData: ProductItemType
}

export default function ProductItem({ productData }: ProductItemProps) {
  const [isOpenQuickView, setIsOpenQuickView] = React.useState<boolean>(false)

  const { addProductToCartMutation } = useCart({
    enabledGetMyCart: false
  })

  return (
    <React.Fragment>
      <div className='border rounded-md bg-card overflow-hidden relative'>
        {productData.priceAfterDiscount < productData.price && (
          <div className='absolute top-0 right-0 px-2 py-1 text-xs font-semibold bg-primary rounded-bl-lg text-white'>
            -{rateSale(productData.price, productData.priceAfterDiscount)}%
          </div>
        )}
        <Link to={PATH.PRODUCT_DETAIL({ name: productData.name, id: productData._id })} className='block'>
          <img src={productData.thumbnail.url} alt={productData.name} className='object-cover' />
        </Link>
        <div className='p-2 pb-4 space-y-4'>
          <div className='space-y-1'>
            <Link
              to={PATH.PRODUCT_DETAIL({ name: productData.name, id: productData._id })}
              className='text-sm hover:underline line-clamp-1 font-medium'
            >
              {productData.name}
            </Link>
            {productData.priceAfterDiscount < productData.price ? (
              <div className='space-y-1'>
                <div className='font-medium text-primary text-[15px]'>
                  {formatCurrency(productData.priceAfterDiscount)}&#8363;
                </div>
                <div className='text-muted-foreground text-sm line-through'>
                  {formatCurrency(productData.price)}&#8363;
                </div>
              </div>
            ) : (
              <div className='font-medium text-primary text-[15px]'>{formatCurrency(productData.price)}&#8363;</div>
            )}
          </div>
          <div className='flex justify-between items-center space-x-4'>
            <div className='text-xs'>Đã bán 11k</div>
            <div className='flex space-x-1'>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size='icon' variant='outline' className='size-8' onClick={() => setIsOpenQuickView(true)}>
                    <Search className='size-3.5' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Xem nhanh sản phẩm</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size='icon'
                    variant='outline'
                    className='size-8'
                    disabled={
                      addProductToCartMutation.isPending &&
                      addProductToCartMutation.variables.productId === productData._id
                    }
                    onClick={() =>
                      addProductToCartMutation.mutate({
                        productId: productData._id,
                        quantity: 1
                      })
                    }
                  >
                    {addProductToCartMutation.isPending &&
                    addProductToCartMutation.variables.productId === productData._id ? (
                      <Loader2 className='size-3.5 animate-spin' />
                    ) : (
                      <ShoppingCart className='size-3.5' />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Thêm một sản phẩm vào giỏ hàng</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={isOpenQuickView} onOpenChange={(value) => setIsOpenQuickView(value)}>
        <DialogContent className='min-w-5xl'>
          <AlertDialogHeader>
            <DialogTitle>Xem nhanh sản phẩm</DialogTitle>
            <DialogDescription>{productData.name}</DialogDescription>
          </AlertDialogHeader>
          <PhotosGrid defaultPhoto={productData.thumbnail.url} photos={productData.photos} />
        </DialogContent>
      </Dialog>
    </React.Fragment>
  )
}
