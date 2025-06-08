import { useQuery } from '@tanstack/react-query'
import { CloudUpload, Loader2, PlusCircle, ShoppingBag, ShoppingCart, Star } from 'lucide-react'
import React from 'react'
import { Link, useParams } from 'react-router'

import productsApis from '~/apis/products.apis'
import PhotosGrid from '~/components/photos-grid'
import QuantityController from '~/components/quantity-controller'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Badge } from '~/components/ui/badge'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '~/components/ui/breadcrumb'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '~/components/ui/dialog'
import { Label } from '~/components/ui/label'
import { Progress } from '~/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Textarea } from '~/components/ui/textarea'
import PATH from '~/constants/path'
import useCart from '~/hooks/use-cart'
import { cn, formatCurrency, getIdFromNameId, rateSale } from '~/lib/utils'

const MAX_PHOTOS_TO_DISPLAY = 5

export default function ProductDetailPage() {
  const params = useParams()
  const nameId = params.nameId
  const productId = getIdFromNameId(nameId ?? '')

  const [currentStar, setCurrentStar] = React.useState<number | null>(null)
  const [quantity, setQuantity] = React.useState<number>(1)
  const [isViewPhoto, setIsViewPhoto] = React.useState<boolean>(false)

  const getProductQuery = useQuery({
    queryKey: ['get-product', productId],
    queryFn: () => productsApis.getProduct(productId),
    enabled: !!productId
  })

  const product = React.useMemo(
    () => getProductQuery.data?.data.data.product,
    [getProductQuery.data?.data.data.product]
  )

  const { addProductToCartMutation } = useCart({
    enabledGetMyCart: false,
    onAddProductToCartSuccess: () => {
      setQuantity(1)
    }
  })

  return (
    <React.Fragment>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to={PATH.HOME}>Trang chủ</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to={PATH.HOME}>{product?.category.name}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product?.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className='flex items-start space-x-10 mt-4 mb-20'>
        {/* Hình ảnh sản phẩm */}
        <div
          className='grid grid-cols-12 gap-4 basis-1/2 sticky top-32 hover:cursor-pointer'
          onClick={() => setIsViewPhoto(true)}
        >
          {product?.photos.slice(0, MAX_PHOTOS_TO_DISPLAY).map((photo) => (
            <div key={photo._id} className='col-span-4'>
              <img src={photo.url} alt='' className='aspect-square object-cover rounded-md' />
            </div>
          ))}
          {product && product.photos.length > MAX_PHOTOS_TO_DISPLAY && (
            <div className='col-span-4 bg-border rounded-md flex justify-center items-center font-semibold text-3xl tracking-widest'>
              +{product.photos.length - MAX_PHOTOS_TO_DISPLAY}
            </div>
          )}
        </div>
        <Dialog open={isViewPhoto} onOpenChange={(value) => setIsViewPhoto(value)}>
          <DialogContent className='min-w-5xl max-h-[90%] overflow-y-auto'>
            <DialogHeader>
              <DialogTitle>Hình ảnh sản phẩm</DialogTitle>
              <DialogDescription>{product?.name}</DialogDescription>
            </DialogHeader>
            {product && <PhotosGrid defaultPhoto={product.thumbnail.url} photos={product.photos} />}
          </DialogContent>
        </Dialog>
        {/* Thông tin sản phẩm */}
        <div className='flex-1 space-y-16'>
          <div className='space-y-6'>
            <Badge variant='outline'>{product?.category.name}</Badge>
            <h1 className='text-xl font-medium'>{product?.name}</h1>
            {/* Số sao đánh giá */}
            <div className='flex items-center space-x-8'>
              <div className='flex items-center space-x-4'>
                <div className='flex items-center space-x-1'>
                  {Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <Star key={index} size={20} className='fill-yellow-500 stroke-yellow-500' />
                    ))}
                </div>
                <div className='font-semibold'>5.0</div>
              </div>
              <div className='text-sm text-muted-foreground'>28 đánh giá</div>
            </div>
            {/* Giá, giảm giá */}
            <div className='flex items-center space-x-4'>
              {product && product.priceAfterDiscount < product.price ? (
                <React.Fragment>
                  <div className='font-semibold text-2xl'>{formatCurrency(product.priceAfterDiscount)}&#8363;</div>
                  <div className='text-muted-foreground line-through text-xl'>
                    {formatCurrency(product.price)}&#8363;
                  </div>
                  <Badge className='bg-destructive text-white'>
                    -{rateSale(product.price, product.priceAfterDiscount)}%
                  </Badge>
                </React.Fragment>
              ) : (
                <div className='font-semibold text-2xl'>{formatCurrency(product?.price ?? 0)}&#8363;</div>
              )}
            </div>
            {/* Số lượng */}
            <div className='flex items-center space-x-6'>
              <QuantityController
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                onDecrease={(value) => setQuantity(value)}
                onIncrease={(value) => setQuantity(value)}
                onType={(value) => setQuantity(value)}
              />
              <div className='text-sm text-muted-foreground'>1721 sản phẩm có sẵn</div>
            </div>
            {/* Thêm giỏ hàng, mua ngay */}
            {product && (
              <div className='flex space-x-2'>
                <Button
                  variant='outline'
                  size='lg'
                  disabled={addProductToCartMutation.isPending}
                  onClick={() =>
                    addProductToCartMutation.mutate({
                      productId: product._id,
                      quantity
                    })
                  }
                >
                  {!addProductToCartMutation.isPending && <ShoppingCart />}
                  {addProductToCartMutation.isPending && <Loader2 className='animate-spin' />}
                  Thêm vào giỏ hàng
                </Button>
                <Button size='lg'>
                  <ShoppingBag />
                  Mua ngay
                </Button>
              </div>
            )}
          </div>
          <Tabs defaultValue='description'>
            <TabsList>
              <TabsTrigger value='description'>Mô tả</TabsTrigger>
              <TabsTrigger value='reviews'>Đánh giá và nhận xét</TabsTrigger>
              <TabsTrigger value='similarProducts'>Sản phẩm tương tự</TabsTrigger>
            </TabsList>
            <TabsContent value='description' className='whitespace-pre-wrap text-sm pt-4'>
              {product?.description}
            </TabsContent>
            <TabsContent value='reviews' className='pt-10'>
              {/* Tổng quan đánh giá */}
              <div className='space-y-2'>
                <h3 className='font-medium tracking-tight'>Tổng quan</h3>
                <div className='flex items-center space-x-4'>
                  <div className='text-3xl font-bold'>5.0</div>
                  <div className='flex items-center space-x-1'>
                    {Array(5)
                      .fill(0)
                      .map((_, index) => (
                        <Star key={index} size={20} className='fill-yellow-500 stroke-yellow-500' />
                      ))}
                  </div>
                </div>
                <p className='text-sm text-muted-foreground'>(3474 đánh giá)</p>
              </div>
              {/* Số lượng đánh giá theo sao */}
              <div className='mt-10 space-y-2'>
                {Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <div key={index} className='flex items-center space-x-4'>
                      <div className='flex items-center space-x-1 w-[100px]'>
                        {Array(5 - index)
                          .fill(0)
                          .map((_, index) => (
                            <Star key={index} size={12} className='fill-yellow-500 stroke-yellow-500' />
                          ))}
                      </div>
                      <Progress value={20} className='w-[300px]' />
                      <div className='text-xs text-muted-foreground'>3403 đánh giá</div>
                    </div>
                  ))}
              </div>
              {/* Danh sách đánh giá */}
              <div className='mt-10'>
                <div className='flex justify-between items-center'>
                  <h3 className='font-medium tracking-tight'>Nhận xét của khách hàng</h3>
                  {/* Thêm đánh giá và nhận xét */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size='sm' variant='outline'>
                        <PlusCircle className='size-4' />
                        Thêm nhận xét
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Thêm nhận xét</DialogTitle>
                        <DialogDescription>{product?.name}</DialogDescription>
                      </DialogHeader>
                      <div className='space-y-8'>
                        <div className='space-y-2'>
                          <Label>Số sao:</Label>
                          <div className='flex space-x-px'>
                            {Array(5)
                              .fill(0)
                              .map((_, index) => {
                                const starValue = index + 1
                                const isActive = currentStar && starValue <= currentStar
                                return (
                                  <button
                                    key={index}
                                    className={cn('border p-1 hover:cursor-pointer rounded-sm', {
                                      'border-yellow-500': isActive
                                    })}
                                    onMouseEnter={() => setCurrentStar(starValue)}
                                  >
                                    <Star
                                      className={cn('size-4', {
                                        'fill-yellow-500 stroke-yellow-500': isActive
                                      })}
                                    />
                                  </button>
                                )
                              })}
                          </div>
                        </div>
                        <div className='space-y-2'>
                          <Label>Hình ảnh thực tế:</Label>
                          <div className='grid grid-cols-12 gap-2'>
                            {Array(4)
                              .fill(0)
                              .map((_, index) => (
                                <div key={index} className='col-span-2'>
                                  <img
                                    src={product?.thumbnail.url}
                                    alt=''
                                    className='aspect-square rounded-sm object-cover'
                                  />
                                </div>
                              ))}
                          </div>
                          <Button variant='outline' size='sm'>
                            <CloudUpload className='size-4' />
                            Tải ảnh lên
                          </Button>
                        </div>
                        <div className='space-y-2'>
                          <Label>Nội dung nhận xét:</Label>
                          <Textarea className='min-16 resize-none' />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant='outline'>Hủy bỏ</Button>
                        <Button>Thêm nhận xét</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className='mt-6 grid grid-cols-12 gap-4'>
                  {Array(20)
                    .fill(0)
                    .map((_, index) => (
                      <div key={index} className='col-span-6 space-y-4 border rounded-lg p-4'>
                        {index % 2 === 0 && <Badge className='bg-green-500'>Rất hài lòng</Badge>}
                        {index % 2 !== 0 && <Badge variant='destructive'>Rất không hài lòng</Badge>}
                        <div className='flex items-center space-x-2'>
                          <Link to={PATH.HOME} className='shrink-0'>
                            <Avatar>
                              <AvatarImage src={product?.author.avatar} alt='' />
                              <AvatarFallback>TR</AvatarFallback>
                            </Avatar>
                          </Link>
                          <div className='flex-1 space-y-1'>
                            <Link to={PATH.HOME} className='inline-block text-sm font-medium'>
                              Trần Hải Triều
                            </Link>
                            <div className='flex items-center space-x-1'>
                              {Array(5)
                                .fill(0)
                                .map((_, index) => (
                                  <Star key={index} size={12} className='fill-yellow-500 stroke-yellow-500' />
                                ))}
                            </div>
                          </div>
                          <div className='text-xs text-muted-foreground'>1 giờ trước.</div>
                        </div>
                        <div className='text-sm'>
                          Truyện hay, mk phải đọc xong mới có thể đánh giá toàn diện một sản phẩm. Truyện vừa hay, ý
                          nghĩa, thể hiện khảo khát được đến trường của các em vùng khó khăn. Sách của Nhã Nam quyển nào
                          cx hay hết đó mn. Còn mua hàng trên Tiki thì rõ là OK luôn, giáo hàng nhanh, hàng lại chất
                          lượng nữa, không bị hỏng hóc j luôn ?
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value='similarProducts'>Change your password here.</TabsContent>
          </Tabs>
        </div>
      </div>
    </React.Fragment>
  )
}
