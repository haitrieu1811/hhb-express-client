import { useQuery } from '@tanstack/react-query'
import { Clock, Code, DollarSign, MapPin, ShoppingCart } from 'lucide-react'
import moment from 'moment'
import React from 'react'
import { toast } from 'sonner'

import ordersApis from '~/apis/orders.apis'
import { Button } from '~/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Separator } from '~/components/ui/separator'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '~/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip'
import { ORDER_STATUS_BADGE } from '~/constants/data'
import { OrderStatus } from '~/constants/enum'
import useUpdateOrder from '~/hooks/use-update-order'
import { cn, convertMomentFromNowToVietnamese, formatCurrency } from '~/lib/utils'
import { OrderItem } from '~/types/orders.types'

export default function DashboardOrdersPage() {
  const [currentOrder, setCurrentOrder] = React.useState<OrderItem | null>(null)

  const getAllOrdersQuery = useQuery({
    queryKey: ['get-all-orders'],
    queryFn: () => ordersApis.getAllOrders()
  })

  const orders = React.useMemo(
    () => getAllOrdersQuery.data?.data.data.orders ?? [],
    [getAllOrdersQuery.data?.data.data.orders]
  )

  const { updateOrderMutation } = useUpdateOrder({
    onSuccess: (data) => {
      toast.success(data.data.message)
      getAllOrdersQuery.refetch()
    }
  })

  const handleUpdateOrder = ({ orderId, status }: { orderId: string | undefined; status: OrderStatus }) => {
    if (!orderId) return
    updateOrderMutation.mutate({ orderId, status })
  }

  return (
    <React.Fragment>
      <div className='space-y-4'>
        <h1 className='font-medium tracking-tight text-xl'>Quản lý đơn hàng</h1>
        <Tabs defaultValue='all' className='gap-4'>
          <TabsList>
            <TabsTrigger value='all'>Tất cả</TabsTrigger>
            <TabsTrigger value='waiting'>Chờ xác nhận</TabsTrigger>
            <TabsTrigger value='confirmed'>Đã xác nhận</TabsTrigger>
            <TabsTrigger value='delivering'>Đang vận chuyển</TabsTrigger>
            <TabsTrigger value='success'>Đã nhận hàng</TabsTrigger>
            <TabsTrigger value='cancel'>Đã hủy</TabsTrigger>
          </TabsList>
          <TabsContent value='all'>
            <div className='grid grid-cols-12 gap-4'>
              {orders.map((order) => (
                <div key={order._id} className='col-span-3'>
                  <Card
                    className={cn('rounded-md shadow-none duration-100', {
                      'border-primary pointer-events-none': order._id === currentOrder?._id,
                      'hover:border-primary hover:cursor-pointer pointer-events-auto': order._id !== currentOrder?._id
                    })}
                    onClick={() => setCurrentOrder(order)}
                  >
                    <CardHeader>
                      <CardTitle>{order.address.fullName}</CardTitle>
                      <CardDescription>{order.address.phoneNumber}</CardDescription>
                      <CardAction>{ORDER_STATUS_BADGE[order.status]}</CardAction>
                    </CardHeader>
                    <CardContent>
                      <div className='space-y-4'>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className='inline-flex items-center space-x-2 text-sm text-muted-foreground'>
                              <Clock className='size-4 shrink-0 stroke-1' />
                              <span>{convertMomentFromNowToVietnamese(moment(order.orderedAt).fromNow())}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>{moment(order.orderedAt).format('HH:mm DD-MM-YYYY')}</TooltipContent>
                        </Tooltip>
                        <div className='flex items-center space-x-2 text-sm text-muted-foreground'>
                          <MapPin className='size-4 shrink-0 stroke-1' />
                          <span>
                            {order.address.detail}, {order.address.ward.prefix} {order.address.ward.name},{' '}
                            {order.address.district.name}, {order.address.province.name}
                          </span>
                        </div>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className='inline-flex items-center space-x-2 text-sm text-muted-foreground'>
                              <Code className='size-4 shrink-0 stroke-1' />
                              <span>{order.code}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>Mã đơn hàng</TooltipContent>
                        </Tooltip>
                      </div>
                    </CardContent>
                    <CardFooter className='justify-end'>
                      <div className='flex items-center space-x-4 text-sm'>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className='flex items-center space-x-1 font-medium'>
                              <ShoppingCart className='size-4' />
                              <span>{order.totalItems}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>Tổng sản phẩm của đơn hàng</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className='flex items-center space-x-1 font-medium'>
                              <DollarSign className='size-4' />
                              <span>{formatCurrency(order.totalAmount)}&#8363;</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>Tổng tiền của đơn hàng</TooltipContent>
                        </Tooltip>
                      </div>
                    </CardFooter>
                  </Card>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value='password'>Change your password here.</TabsContent>
        </Tabs>
      </div>
      {/* Chi tiết đơn hàng */}
      <Sheet
        open={!!currentOrder}
        onOpenChange={(value) => {
          if (!value) {
            setCurrentOrder(null)
          }
        }}
      >
        <SheetContent className='max-h-screen overflow-y-auto'>
          <SheetHeader>
            <SheetTitle>{currentOrder?.code}</SheetTitle>
            <SheetDescription>
              {convertMomentFromNowToVietnamese(moment(currentOrder?.orderedAt).fromNow())}
            </SheetDescription>
          </SheetHeader>
          <div className='px-4 pb-4 space-y-6 tracking-tight'>
            <div className='flex items-center justify-between space-x-10'>
              {!!currentOrder && ORDER_STATUS_BADGE[currentOrder.status]}
              <Select
                onValueChange={(value) =>
                  handleUpdateOrder({
                    orderId: currentOrder?._id,
                    status: Number(value)
                  })
                }
              >
                <SelectTrigger className='w-[200px]'>
                  <SelectValue placeholder='Trạng thái đơn hàng' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={OrderStatus.Waiting.toString()}>Chờ xác nhận</SelectItem>
                  <SelectItem value={OrderStatus.Confirmed.toString()}>Đã xác nhận</SelectItem>
                  <SelectItem value={OrderStatus.Delivering.toString()}>Đang vận chuyển</SelectItem>
                  <SelectItem value={OrderStatus.Success.toString()}>Hoàn thành</SelectItem>
                  <SelectItem value={OrderStatus.Cancel.toString()}>Hủy bỏ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='space-y-4'>
              <h3 className='font-medium text-sm'>Thông tin đơn hàng</h3>
              <div className='space-y-2'>
                <div className='text-sm text-muted-foreground flex items-center justify-between space-x-10'>
                  <div>Người mua hàng</div>
                  <div>{currentOrder?.address.fullName}</div>
                </div>
                <div className='text-sm text-muted-foreground flex items-center justify-between space-x-10'>
                  <div>Số điện thoại</div>
                  <div className='flex items-center space-x-2'>
                    <div>{currentOrder?.address.phoneNumber}</div>
                    <Button size='sm' variant='outline' className='text-xs h-7'>
                      Sao chép
                    </Button>
                  </div>
                </div>
                <div className='text-sm text-muted-foreground flex items-center justify-between space-x-10'>
                  <div>Địa chỉ nhận hàng</div>
                  <div>
                    {currentOrder?.address.detail}, {currentOrder?.address.ward.prefix}{' '}
                    {currentOrder?.address.ward.name}, {currentOrder?.address.district.name},{' '}
                    {currentOrder?.address.province.name}
                  </div>
                </div>
              </div>
            </div>
            <Separator />
            <div className='space-y-4'>
              <h3 className='font-medium text-sm'>Sản phẩm cần chuẩn bị</h3>
              <div className='space-y-2'>
                {currentOrder?.items.map((item) => (
                  <div key={item._id} className='flex justify-between space-x-4'>
                    <img
                      src={item.product.thumbnail.url}
                      alt={item.product.name}
                      className='size-20 rounded-md object-cover aspect-square shrink-0'
                    />
                    <div className='flex-1 space-y-1'>
                      <h3 title={item.product.name} className='font-medium text-sm line-clamp-2'>
                        {item.product.name}
                      </h3>
                      <div className='text-sm text-muted-foreground'>Số lượng: {item.quantity}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Separator />
            <div className='space-y-4'>
              <h3 className='font-medium text-sm'>Tóm tắt thanh toán</h3>
              <div className='space-y-2'>
                <div className='flex justify-between items-center space-x-10'>
                  <div className='text-muted-foreground text-sm'>Tổng sản phẩm</div>
                  <div className='font-medium'>{currentOrder?.totalItems} sản phẩm</div>
                </div>
                <div className='flex justify-between items-center space-x-10'>
                  <div className='text-muted-foreground text-sm'>Tổng tiền</div>
                  <div className='font-medium'>{formatCurrency(currentOrder?.totalAmount ?? 0)}&#8363;</div>
                </div>
                <div className='flex justify-between items-center space-x-10'>
                  <div className='text-muted-foreground text-sm'>Tổng giảm giá</div>
                  <div className='font-medium'>{formatCurrency(0)}&#8363;</div>
                </div>
                <div className='flex justify-between items-center space-x-10'>
                  <div className='text-muted-foreground text-sm'>Tổng tiền thanh toán</div>
                  <div className='font-medium text-primary'>
                    {formatCurrency(currentOrder?.totalAmount ?? 0)}&#8363;
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </React.Fragment>
  )
}
