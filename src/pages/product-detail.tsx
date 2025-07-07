import { useQuery } from '@tanstack/react-query'
import { Angry, Annoyed, Frown, Laugh, Loader2, ShoppingBag, ShoppingCart, Smile, Star } from 'lucide-react'
import moment from 'moment'
import React from 'react'
import { Link, useParams } from 'react-router'

import productsApis from '~/apis/products.apis'
import reviewsApis from '~/apis/reviews.apis'
import PhotosGrid from '~/components/photos-grid'
import ProductItem from '~/components/product-item'
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
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Progress } from '~/components/ui/progress'
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip'
import PATH from '~/constants/path'
import useBlogs from '~/hooks/use-blogs'
import useCart from '~/hooks/use-cart'
import usePublicProducts from '~/hooks/use-public-products'
import { cn, convertMomentFromNowToVietnamese, formatCurrency, getIdFromNameId, rateSale } from '~/lib/utils'

const MAX_PHOTOS_TO_DISPLAY = 5

export default function ProductDetailPage() {
  const params = useParams()
  const nameId = params.nameId
  const productId = getIdFromNameId(nameId ?? '')

  const [quantity, setQuantity] = React.useState<number>(1)
  const [isViewPhoto, setIsViewPhoto] = React.useState<boolean>(false)
  const [isReadMore, setIsReadMore] = React.useState<boolean>(false)

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

  const { blogs } = useBlogs({
    limit: '5'
  })

  const getReviewsQuery = useQuery({
    queryKey: ['get-reviews'],
    queryFn: () => reviewsApis.getReviewsByProductId(productId as string),
    enabled: !!productId
  })

  const reviews = React.useMemo(
    () => getReviewsQuery.data?.data.data.reviews ?? [],
    [getReviewsQuery.data?.data.data.reviews]
  )

  const totalReviews = getReviewsQuery.data?.data.data.pagination.totalRows ?? 0

  const statistics = React.useMemo(
    () => getReviewsQuery.data?.data.data.statistics,
    [getReviewsQuery.data?.data.data.statistics]
  )

  // Thống kê theo sao
  const statisticsByStar = React.useMemo(
    () => ({
      [5]: {
        quantity: statistics?.totalFiveStar ?? 0,
        percent: (100 / totalReviews) * (statistics?.totalFiveStar ?? 0)
      },
      [4]: {
        quantity: statistics?.totalFourStar ?? 0,
        percent: (100 / totalReviews) * (statistics?.totalFourStar ?? 0)
      },
      [3]: {
        quantity: statistics?.totalThreeStar ?? 0,
        percent: (100 / totalReviews) * (statistics?.totalThreeStar ?? 0)
      },
      [2]: {
        quantity: statistics?.totalTwoStar ?? 0,
        percent: (100 / totalReviews) * (statistics?.totalTwoStar ?? 0)
      },
      [1]: {
        quantity: statistics?.totalOneStar ?? 0,
        percent: (100 / totalReviews) * (statistics?.totalOneStar ?? 0)
      }
    }),
    [statistics, totalReviews]
  )

  const { products } = usePublicProducts({})

  return (
    <div className='space-y-4'>
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
      <div className='flex items-start space-x-4'>
        {/* Hình ảnh sản phẩm */}
        <Card className='basis-1/2 sticky top-32 hover:cursor-pointer'>
          <CardContent>
            <div className='grid grid-cols-12 gap-4' onClick={() => setIsViewPhoto(true)}>
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
          </CardContent>
        </Card>
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
        <Card className='flex-1'>
          <CardContent>
            <div className='space-y-6'>
              <div>
                <Badge variant='outline'>{product?.category.name}</Badge>
                <h1 className='text-2xl font-semibold mt-4'>{product?.name}</h1>
                {/* Số sao đánh giá */}
                {totalReviews > 0 && (
                  <div className='flex items-center space-x-4 font-medium mt-6'>
                    <div className='flex items-center space-x-2'>
                      <div className='text-lg'>{product?.starPoints}</div>
                      <Star className='size-4 fill-yellow-500 dark:fill-yellow-600 stroke-yellow-500 dark:stroke-yellow-600' />
                    </div>
                    <div className='text-sm'>{totalReviews} đánh giá</div>
                    <div className='text-sm'>Đã bán 6.7k</div>
                  </div>
                )}
                {/* Giá, giảm giá */}
                <div className='flex items-center space-x-4 mt-4'>
                  {product && product.priceAfterDiscount < product.price ? (
                    <React.Fragment>
                      <div className='font-semibold text-3xl text-primary'>
                        {formatCurrency(product.priceAfterDiscount)}&#8363;
                      </div>
                      <div className='text-muted-foreground line-through text-xl'>
                        {formatCurrency(product.price)}&#8363;
                      </div>
                      <Badge>Giảm {rateSale(product.price, product.priceAfterDiscount)}%</Badge>
                    </React.Fragment>
                  ) : (
                    <div className='font-semibold text-3xl text-primary'>
                      {formatCurrency(product?.price ?? 0)}&#8363;
                    </div>
                  )}
                </div>
                {/* Số lượng */}
                <div className='flex items-center space-x-6 mt-10'>
                  <QuantityController
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    onDecrease={(value) => setQuantity(value)}
                    onIncrease={(value) => setQuantity(value)}
                    onType={(value) => setQuantity(value)}
                  />
                  <div className='text-sm'>1721 sản phẩm có sẵn</div>
                </div>
                {/* Thêm giỏ hàng, mua ngay */}
                {product && (
                  <div className='flex space-x-2 mt-4'>
                    <Button
                      variant='outline'
                      size='lg'
                      disabled={addProductToCartMutation.isPending}
                      className='flex-auto capitalize'
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
                    <Button size='lg' className='flex-auto capitalize'>
                      <ShoppingBag />
                      Mua ngay
                    </Button>
                  </div>
                )}
              </div>
              <div className='space-y-4 mt-20'>
                <h3 className='text-xl font-medium tracking-tight'>Mô tả sản phẩm</h3>
                <div
                  className={cn('whitespace-pre-line text-sm', {
                    'max-h-[200px] overflow-y-hidden': !isReadMore,
                    'h-auto': isReadMore
                  })}
                >
                  {product?.description}
                </div>
                <div className='flex justify-center'>
                  <Button variant='link' className='px-0' onClick={() => setIsReadMore((prevState) => !prevState)}>
                    {isReadMore ? 'Thu gọn' : 'Đọc tiếp'} mô tả sản phẩm
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className='flex items-start space-x-4'>
        {/* Đánh giá và nhận xét */}
        <Card className='flex-1'>
          <CardHeader>
            <CardTitle className='text-xl'>Đánh giá và nhận xét</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-8'>
              {/* Tổng quan đánh giá */}
              <div className='flex justify-between items-center space-x-10'>
                <div className='flex-1 flex flex-col items-center justify-center space-y-2'>
                  <div className='text-3xl font-bold'>{statistics?.starPoints}</div>
                  <div className='flex items-center space-x-1'>
                    {Array(5)
                      .fill(0)
                      .map((_, index) => (
                        <Star
                          key={index}
                          className='size-5 fill-yellow-500 dark:fill-yellow-600 stroke-yellow-500 dark:stroke-yellow-600'
                        />
                      ))}
                  </div>
                  <p className='text-sm text-muted-foreground'>{totalReviews} đánh giá</p>
                </div>
                {/* Số lượng đánh giá theo sao */}
                <div className='space-y-2'>
                  {Array(5)
                    .fill(0)
                    .map((_, index) => {
                      const star = (5 - index) as 1 | 2 | 3 | 4 | 5
                      return (
                        <div key={index} className='flex items-center space-x-4'>
                          <div className='flex items-center space-x-1'>
                            {Array(5)
                              .fill(0)
                              .map((_, index) => (
                                <Star
                                  key={index}
                                  className={cn('size-4', {
                                    'fill-yellow-500 dark:fill-yellow-600 stroke-yellow-500 dark:stroke-yellow-600':
                                      index < star,
                                    'fill-muted stroke-muted': index >= star
                                  })}
                                />
                              ))}
                          </div>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Progress value={statisticsByStar[star].percent} className='w-[250px] h-1.5' />
                            </TooltipTrigger>
                            <TooltipContent>{statisticsByStar[star].percent}%</TooltipContent>
                          </Tooltip>
                          <div className='text-xs text-muted-foreground'>
                            {statisticsByStar[star].quantity} đánh giá
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
              {/* Danh sách đánh giá */}
              <div className='space-y-2'>
                <h3 className='font-medium tracking-tight'>Nhận xét của khách hàng</h3>
                {reviews.length > 0 && (
                  <div className='grid grid-cols-12'>
                    {reviews.map((review) => (
                      <div key={review._id} className='col-span-12 space-y-4 py-6 border-t first:border-t-0'>
                        {review.starPoints === 5 && (
                          <div className='flex items-center space-x-2 text-green-500 dark:text-green-600'>
                            <Laugh className='size-5' />
                            <span className='text-xs font-medium'>Tuyệt vời</span>
                          </div>
                        )}
                        {review.starPoints === 4 && (
                          <div className='flex items-center space-x-2 text-blue-500 dark:text-blue-600'>
                            <Smile className='size-5' />
                            <span className='text-xs font-medium'>Hài lòng</span>
                          </div>
                        )}
                        {review.starPoints === 3 && (
                          <div className='flex items-center space-x-2 text-yellow-500 dark:text-yellow-600'>
                            <Annoyed className='size-5' />
                            <span className='text-xs font-medium'>Bình thường</span>
                          </div>
                        )}
                        {review.starPoints === 2 && (
                          <div className='flex items-center space-x-2 text-violet-500 dark:text-violet-600'>
                            <Frown className='size-5' />
                            <span className='text-xs font-medium'>Không hài lòng</span>
                          </div>
                        )}
                        {review.starPoints === 1 && (
                          <div className='flex items-center space-x-2 text-red-500 dark:text-red-600'>
                            <Angry className='size-5' />
                            <span className='text-xs font-medium'>Thất vọng</span>
                          </div>
                        )}
                        <div className='flex items-center space-x-2'>
                          <Avatar className='shrink-0'>
                            <AvatarImage src={review.author.avatar} alt={review.author.fullName} />
                            <AvatarFallback>
                              {review.author.fullName[0].toUpperCase()}
                              {review.author.fullName[1].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className='flex-1 space-y-1'>
                            <h3 className='inline-block text-sm font-medium'>{review.author.fullName}</h3>
                            <div className='flex items-center space-x-1'>
                              {Array(review.starPoints)
                                .fill(0)
                                .map((_, index) => (
                                  <Star key={index} size={12} className='fill-yellow-500 stroke-yellow-500' />
                                ))}
                            </div>
                          </div>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className='text-xs text-muted-foreground'>
                                {convertMomentFromNowToVietnamese(moment(review.createdAt).fromNow())}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>{moment(review.createdAt).format('HH:mm DD-MM-YYYY')}</TooltipContent>
                          </Tooltip>
                        </div>
                        {review.content && <div className='text-sm'>{review.content}</div>}
                        {review.photos.length > 0 && (
                          <div className='grid grid-cols-12 gap-2'>
                            {review.photos.map((photo) => (
                              <a key={photo} href={photo} target='_blank' className='col-span-1'>
                                <img src={photo} alt={photo} className='w-full aspect-square rounded-md object-cover' />
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Bài viết */}
        <Card className='w-1/3'>
          <CardHeader>
            <CardTitle className='text-xl'>Bài viết</CardTitle>
            <CardAction>
              <Button asChild variant='link' size='sm'>
                <Link to={PATH.BLOGS}>Xem thêm bài viết</Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className='space-y-4'>
            {blogs.map((blog) => (
              <div key={blog._id} className='flex items-start space-x-4'>
                <Link
                  to={PATH.BLOG_DETAIL({
                    name: blog.title,
                    id: blog._id
                  })}
                  className='shrink-0'
                >
                  <img
                    src={blog.thumbnail.url}
                    alt={blog.title}
                    className='w-[100px] aspect-video object-cover rounded-md'
                  />
                </Link>
                <div className='flex-1'>
                  <Link
                    to={PATH.BLOG_DETAIL({
                      name: blog.title,
                      id: blog._id
                    })}
                    className='font-medium text-sm hover:underline line-clamp-2'
                  >
                    {blog.title}
                  </Link>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className='text-xl'>Sản phẩm cùng danh mục</CardTitle>
          <CardAction>
            <Button asChild variant='link' className='p-0'>
              <Link to={PATH.PRODUCTS}>Xem thêm sản phẩm cùng danh mục</Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-10 gap-4'>
            {products.slice(0, 5).map((product) => (
              <div key={product._id} className='col-span-2'>
                <ProductItem productData={product} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
