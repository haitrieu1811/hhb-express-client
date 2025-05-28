import { Search, ShoppingBag, ShoppingCart, Star } from 'lucide-react'
import React from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '~/components/ui/carousel'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '~/components/ui/sheet'
import { Skeleton } from '~/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { formatCurrency, rateSale } from '~/lib/utils'
import { AppContext } from '~/providers/app.provider'

type ProductPreviewProps = {
  thumbnailPreview: string | null
  name: string
  price: number
  priceAfterDiscount: number
  description: string
  previewPhotos: string[]
}

export default function ProductPreview({
  thumbnailPreview,
  name,
  price,
  priceAfterDiscount,
  description,
  previewPhotos
}: ProductPreviewProps) {
  const { profile } = React.useContext(AppContext)

  const [isOpenViewDetailPage, setIsOpenViewDetailPage] = React.useState<boolean>(false)

  return (
    <React.Fragment>
      <div className='space-y-10'>
        <div className='space-y-3'>
          {!thumbnailPreview && <Skeleton className='aspect-video rounded-lg' />}
          {thumbnailPreview && <img src={thumbnailPreview} alt='' className='aspect-square rounded-lg object-cover' />}
          {name.length > 0 && <div className='text-sm font-medium line-clamp-2'>{name}</div>}
          {name.length === 0 && <Skeleton className='h-6 w-3/4' />}
          {price > 0 || priceAfterDiscount > 0 ? (
            <div className='flex items-center space-x-4'>
              <div className='flex-1'>
                {/* Giá sau khi khuyến mãi */}
                {priceAfterDiscount < price ? (
                  <div className='text-lg font-semibold'>{formatCurrency(priceAfterDiscount)}&#8363;</div>
                ) : (
                  <div className='text-lg font-semibold'>{formatCurrency(price)}&#8363;</div>
                )}
                {/* Giá gốc */}
                {priceAfterDiscount < price && (
                  <div className='text-muted-foreground line-through'>{formatCurrency(price)}&#8363;</div>
                )}
              </div>
              {/* Phần trăm khuyến mãi */}
              {priceAfterDiscount < price && (
                <Badge variant='destructive'>-{rateSale(price, priceAfterDiscount)}%</Badge>
              )}
            </div>
          ) : (
            <Skeleton className='h-6 w-1/2' />
          )}
          <div className='flex justify-end'>
            <div className='flex items-center space-x-2'>
              <Avatar className='size-6 rounded-lg'>
                <AvatarImage src={profile?.avatar} alt={profile?.fullName} />
                <AvatarFallback>
                  {profile?.fullName[0].toUpperCase()}
                  {profile?.fullName[1].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className='text-sm text-muted-foreground'>{profile?.fullName}</div>
            </div>
          </div>
        </div>
        <div className='flex justify-center'>
          <Button type='button' variant='outline' size='sm' onClick={() => setIsOpenViewDetailPage(true)}>
            <Search className='size-4' />
            Xem trang chi tiết
          </Button>
        </div>
      </div>

      <Sheet open={isOpenViewDetailPage} onOpenChange={(value) => setIsOpenViewDetailPage(value)}>
        <SheetContent className='min-w-4/5 max-h-screen overflow-y-auto'>
          <SheetHeader>
            <SheetTitle>Chi tiết sản phẩm</SheetTitle>
          </SheetHeader>
          <div className='grid grid-cols-12 gap-4 px-4 pb-4'>
            <div className='col-span-4'>
              <Card>
                <CardContent className='space-y-3'>
                  {thumbnailPreview && (
                    <img src={thumbnailPreview} alt='' className='w-full aspect-square object-cover rounded-lg' />
                  )}
                  {!thumbnailPreview && <Skeleton className='w-full aspect-square' />}
                  <Carousel>
                    <CarouselContent className='-pl-3'>
                      {previewPhotos.length === 0 &&
                        Array(4)
                          .fill(0)
                          .map((_, index) => (
                            <CarouselItem key={index} className='basis-1/5 pl-3'>
                              <Skeleton className='aspect-square' />
                            </CarouselItem>
                          ))}
                      {previewPhotos.length > 0 &&
                        previewPhotos.map((previewPhoto) => (
                          <CarouselItem key={previewPhoto} className='basis-1/5 pl-3'>
                            <img src={previewPhoto} alt='' className='aspect-square object-cover rounded-lg' />
                          </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className='left-0' />
                    <CarouselNext className='right-0' />
                  </Carousel>
                </CardContent>
              </Card>
            </div>
            <div className='col-span-5 space-y-4'>
              <Card>
                <CardContent className='space-y-8'>
                  {name.length > 0 && <h1 className='text-xl font-medium tracking-tight'>{name}</h1>}
                  {name.length === 0 && <Skeleton className='w-4/5 h-9' />}
                  <div className='flex items-center space-x-8'>
                    <div className='flex items-center space-x-4'>
                      <div className='flex items-center space-x-1'>
                        {Array(5)
                          .fill(0)
                          .map((_, index) => (
                            <Star key={index} size={25} className='fill-yellow-500 stroke-yellow-500' />
                          ))}
                      </div>
                      <div className='font-semibold'>5.0</div>
                    </div>
                    <div className='text-sm text-muted-foreground'>28 đánh giá</div>
                  </div>
                  {price > 0 || priceAfterDiscount > 0 ? (
                    <div className='flex items-center space-x-4'>
                      <div className='text-2xl font-semibold'>
                        {priceAfterDiscount < price ? formatCurrency(priceAfterDiscount) : formatCurrency(price)}&#8363;
                      </div>
                      {priceAfterDiscount < price && (
                        <React.Fragment>
                          <div className='text-muted-foreground line-through'>{formatCurrency(price)}&#8363;</div>
                          <Badge variant='destructive'>-{rateSale(price, priceAfterDiscount)}%</Badge>
                        </React.Fragment>
                      )}
                    </div>
                  ) : (
                    <Skeleton className='w-3/4 h-6' />
                  )}
                  <div className='flex space-x-2'>
                    <Button size='lg' variant='outline'>
                      <ShoppingCart className='size-5 stroke-1' />
                      Thêm vào giỏ hàng
                    </Button>
                    <Button size='lg'>
                      <ShoppingBag className='size-5 stroke-1' />
                      Mua ngay
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <Tabs defaultValue='description' className='w-full'>
                    <TabsList>
                      <TabsTrigger value='description'>Mô tả</TabsTrigger>
                      <TabsTrigger value='review'>Đánh giá</TabsTrigger>
                    </TabsList>
                    <TabsContent value='description' className='pt-4'>
                      {description}
                    </TabsContent>
                    <TabsContent value='review'>Change your password here.</TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
            <div className='col-span-3'>
              <Card>
                <CardContent>
                  <div className='flex items-center space-x-2'>
                    <Avatar className='size-10 rounded-lg'>
                      <AvatarImage src={profile?.avatar} alt='' />
                      <AvatarFallback>
                        {profile?.fullName[0].toUpperCase()}
                        {profile?.fullName[1].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className='flex-1'>
                      <div className='font-medium'>{profile?.fullName}</div>
                      <div className='text-sm text-muted-foreground'>10 sản phẩm</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </React.Fragment>
  )
}
