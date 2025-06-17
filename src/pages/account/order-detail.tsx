import { CheckCheck, ChevronLeft, Import, NotepadText, Star, Truck, X } from 'lucide-react'
import moment from 'moment'
import React from 'react'
import { Link, useNavigate, useParams } from 'react-router'

import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'
import { ORDER_STATUS_BADGE } from '~/constants/data'
import { OrderStatus } from '~/constants/enum'
import PATH from '~/constants/path'
import useOrder from '~/hooks/use-order'
import { cn, formatCurrency } from '~/lib/utils'

export default function AccountOrderDetailPage() {
  const params = useParams()
  const navigate = useNavigate()

  const { orderId } = params
  const { order } = useOrder(orderId ?? '')

  const orderHistories = React.useMemo(
    () => [
      {
        icon: NotepadText,
        label: 'Đơn hàng đã đặt',
        time: moment(order?.orderedAt).format('DD-MM-YYYY'),
        isVisible: order?.orderedAt
      },
      {
        icon: CheckCheck,
        label: 'Đã xác nhận thông tin thành toán',
        time: '1 giờ trước',
        isVisible: order?.confirmedAt
      },
      {
        icon: Truck,
        label: 'Đã giao cho đơn vị vận chuyển',
        time: '1 giờ trước',
        isVisible: order?.shippedAt
      },
      {
        icon: Import,
        label: 'Đã nhận được hàng',
        time: '1 giờ trước',
        isVisible: order?.succeededAt
      },
      {
        icon: Star,
        label: 'Đơn hàng đã hoàn thành',
        time: '1 giờ trước',
        isVisible: order?.succeededAt
      }
    ],
    [order]
  )

  if (!order) {
    return null
  }

  return (
    <Card className='rounded-md shadow-none'>
      <CardContent>
        <div className='flex justify-between items-center'>
          <Button variant='ghost' size='sm' onClick={() => navigate(-1)}>
            <ChevronLeft className='size-4' />
            Quay lại
          </Button>
          <div className='flex items-center space-x-2 text-sm'>
            <div>Mã đơn hàng: {order?.code}</div>
            <Separator orientation='vertical' className='h-1' />
            {ORDER_STATUS_BADGE[order.status]}
          </div>
        </div>
        {/* Lịch sử tiến trình đơn hàng */}
        {order.status !== OrderStatus.Cancel && (
          <div className='py-16 flex space-x-10'>
            {orderHistories.map((item, index) => (
              <div key={index} className='flex flex-col items-center space-y-3 basis-1/5'>
                <div
                  className={cn('size-14 border-3 rounded-full flex justify-center items-center', {
                    'border-green-500 dark:border-green-600': item.isVisible
                  })}
                >
                  <item.icon
                    className={cn({
                      'stroke-border': !item.isVisible,
                      'stroke-green-500 dark:stroke-green-600': item.isVisible
                    })}
                  />
                </div>
                <p
                  className={cn('text-sm font-medium text-center', {
                    'text-muted-foreground': !item.isVisible,
                    'text-green-500 dark:text-green-600': item.isVisible
                  })}
                >
                  {item.label}
                </p>
                {item.isVisible && <p className='text-xs text-muted-foreground'>{item.time}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Danh sách sản phẩm đặt mua */}
        <div className='space-y-6 mt-10'>
          {order?.items.map((item) => (
            <div key={item._id} className='flex items-start space-x-4'>
              <Link
                to={PATH.PRODUCT_DETAIL({
                  name: item.product.name,
                  id: item.product._id
                })}
              >
                <img
                  src={item.product.thumbnail.url}
                  alt={item.product.name}
                  className='size-20 aspect-square object-cover shrink-0 rounded-md'
                />
              </Link>
              <div className='flex-1 space-y-2'>
                <div className='flex items-start space-x-2'>
                  <Link
                    to={PATH.PRODUCT_DETAIL({
                      name: item.product.name,
                      id: item.product._id
                    })}
                    className='line-clamp-2 font-medium text-sm hover:underline'
                  >
                    {item.product.name}
                  </Link>
                  <div className='flex items-center space-x-1 text-muted-foreground text-sm'>
                    <X className='size-3' />
                    {item.quantity}
                  </div>
                </div>
                <Button variant='outline' size='sm'>
                  Đánh giá sản phẩm
                </Button>
              </div>
              <div className='flex items-center text-sm space-x-2'>
                {item.unitPriceAfterDiscount < item.unitPrice ? (
                  <React.Fragment>
                    <div className='text-muted-foreground line-through'>{formatCurrency(item.unitPrice)}&#8363;</div>
                    <div className='font-medium'>{formatCurrency(item.unitPriceAfterDiscount)}&#8363;</div>
                  </React.Fragment>
                ) : (
                  <div className='font-medium'>{formatCurrency(item.unitPrice)}&#8363;</div>
                )}
              </div>
            </div>
          ))}
        </div>
        {/* Địa chỉ nhận hàng và tổng tiền đơn hàng */}
        <div className='grid grid-cols-12 gap-20 mt-10'>
          <div className='col-span-6'>
            <div className='bg-[repeating-linear-gradient(45deg,#6fa6d6,#6fa6d6_33px,transparent_0,transparent_41px,#f18d9b_0,#f18d9b_74px,transparent_0,transparent_82px)] h-1' />
            <h3 className='mt-4 font-medium tracking-tight text-lg'>Địa chỉ nhận hàng</h3>
            <div className='mt-6 space-y-2 text-sm'>
              <div className='font-medium'>{order?.address.fullName}</div>
              <div>{order?.address.phoneNumber}</div>
              <div className='text-muted-foreground'>
                {order?.address.detail} {order?.address.ward.prefix} {order?.address.ward.name},{' '}
                {order?.address.district.name}, {order?.address.province.name}
              </div>
            </div>
          </div>
          <div className='col-span-6 space-y-3 text-sm'>
            <div className='flex items-center justify-between space-x-20'>
              <span>Tổng tiền hàng</span>
              <span>{formatCurrency(order?.totalAmount ?? 0)}&#8363;</span>
            </div>
            <div className='flex items-center justify-between space-x-20'>
              <span>Tổng sản phẩm</span>
              <span className='font-semibold text-xl text-primary'>{order?.totalItems}</span>
            </div>
            <div className='flex items-center justify-between space-x-20'>
              <span>Tổng thanh toán</span>
              <span className='font-semibold text-xl text-primary'>
                {formatCurrency(order?.totalAmount ?? 0)}&#8363;
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
