import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import moment from 'moment'
import React from 'react'
import { Link } from 'react-router'
import { toast } from 'sonner'

import ordersApis from '~/apis/orders.apis'
import { Button } from '~/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { ORDER_STATUS_BADGE } from '~/constants/data'
import { OrderStatus } from '~/constants/enum'
import PATH from '~/constants/path'
import useUpdateOrder from '~/hooks/use-update-order'
import { convertMomentFromNowToVietnamese, formatCurrency } from '~/lib/utils'
import { AppContext } from '~/providers/app.provider'

export default function AccountOrdersPage() {
  const { isAuthenticated } = React.useContext(AppContext)

  const getMyOrdersQuery = useQuery({
    queryKey: ['get-my-orders', isAuthenticated],
    queryFn: () => ordersApis.getMyOrders(),
    enabled: isAuthenticated
  })

  const myOrders = React.useMemo(
    () => getMyOrdersQuery.data?.data.data.orders ?? [],
    [getMyOrdersQuery.data?.data.data.orders]
  )

  const { updateOrderMutation } = useUpdateOrder({
    onSuccess: () => {
      getMyOrdersQuery.refetch()
    }
  })

  return (
    <Tabs defaultValue='all' className='gap-4'>
      <TabsList>
        <TabsTrigger value='all'>Tất cả</TabsTrigger>
        <TabsTrigger value='waiting'>Chờ xác nhận</TabsTrigger>
        <TabsTrigger value='confirmed'>Đã xác nhận</TabsTrigger>
        <TabsTrigger value='delivering'>Đang vận chuyển</TabsTrigger>
        <TabsTrigger value='success'>Thành công</TabsTrigger>
        <TabsTrigger value='cancel'>Đã hủy</TabsTrigger>
      </TabsList>
      <TabsContent value='all' className='space-y-4'>
        {myOrders.map((order) => (
          <Card key={order._id} className='rounded-md shadow-none'>
            <CardHeader>
              <CardTitle>{order.code}</CardTitle>
              <CardDescription>{convertMomentFromNowToVietnamese(moment(order.createdAt).fromNow())}</CardDescription>
              <CardAction>{ORDER_STATUS_BADGE[order.status]}</CardAction>
            </CardHeader>
            <CardContent className='space-y-4'>
              {order.items.map((item) => (
                <div key={item._id} className='flex items-start space-x-4'>
                  <img
                    src={item.product.thumbnail.url}
                    alt={item.product.name}
                    className='size-20 aspect-square object-cover shrink-0 rounded-md'
                  />
                  <div className='flex-1 space-y-2'>
                    <h3 className='line-clamp-2 font-medium text-sm'>{item.product.name}</h3>
                    <div className='text-sm text-muted-foreground'>Số lượng: {item.quantity}</div>
                  </div>
                  <div className='flex items-center text-sm space-x-2'>
                    {item.unitPriceAfterDiscount < item.unitPrice ? (
                      <React.Fragment>
                        <div className='text-muted-foreground line-through'>
                          {formatCurrency(item.unitPrice)}&#8363;
                        </div>
                        <div className='font-medium'>{formatCurrency(item.unitPriceAfterDiscount)}&#8363;</div>
                      </React.Fragment>
                    ) : (
                      <div className='font-medium'>{formatCurrency(item.unitPrice)}&#8363;</div>
                    )}
                  </div>
                </div>
              ))}
              <div className='flex justify-end items-center space-x-2'>
                <div className='text-sm'>Thành tiền:</div>
                <div className='font-semibold text-primary text-xl'>{formatCurrency(order.totalAmount)}&#8363;</div>
              </div>
            </CardContent>
            <CardFooter className='justify-end space-x-2'>
              <Button variant='secondary'>Mua lại</Button>
              <Button asChild variant='outline'>
                <Link to={PATH.ACCOUNT_ORDER_DETAI(order._id)}>Chi tiết</Link>
              </Button>
              {order.status === OrderStatus.Waiting && (
                <Button
                  variant='destructive'
                  disabled={updateOrderMutation.isPending && updateOrderMutation.variables.orderId === order._id}
                  onClick={() =>
                    updateOrderMutation.mutate(
                      {
                        orderId: order._id,
                        status: OrderStatus.Cancel
                      },
                      {
                        onSuccess: () => {
                          toast.success('Hủy đơn hàng thành công')
                        }
                      }
                    )
                  }
                >
                  {updateOrderMutation.isPending && updateOrderMutation.variables.orderId === order._id && (
                    <Loader2 className='size-4 animate-spin' />
                  )}
                  Hủy đơn hàng
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </TabsContent>
      <TabsContent value='waiting'>Change your password here.</TabsContent>
    </Tabs>
  )
}
