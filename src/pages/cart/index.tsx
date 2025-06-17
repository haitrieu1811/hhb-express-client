import { BadgeCheck, ContactRound, ShoppingCart } from 'lucide-react'
import { Outlet, useLocation } from 'react-router'

import { Card, CardContent } from '~/components/ui/card'

import PATH from '~/constants/path'
import { cn } from '~/lib/utils'

const PROGRESS_DATA = [
  {
    icon: ShoppingCart,
    label: 'Giỏ hàng',
    path: PATH.CART_LIST
  },
  {
    icon: ContactRound,
    label: 'Thông tin đặt hàng',
    path: PATH.CART_ORDER_INFO
  },
  {
    icon: BadgeCheck,
    label: 'Hoàn tất',
    path: PATH.CART_ORDER_SUCCESS
  }
] as const

export default function CartPage() {
  const location = useLocation()
  const { pathname } = location

  return (
    <div className='space-y-4'>
      <Card>
        <CardContent>
          <div className='grid grid-cols-12'>
            {PROGRESS_DATA.map((item, index) => (
              <div key={index} className='col-span-4 flex flex-col justify-center items-center space-y-4'>
                <div
                  className={cn('border p-1 rounded-full', {
                    'border-border': item.path !== pathname,
                    'border-green-500': item.path === pathname
                  })}
                >
                  <div
                    className={cn('size-10 rounded-full flex justify-center items-center text-white', {
                      'bg-border': item.path !== pathname,
                      'bg-green-500': item.path === pathname
                    })}
                  >
                    <item.icon className='size-4.5' />
                  </div>
                </div>
                <div
                  className={cn('font-medium tracking-tight capitalize text-sm', {
                    'text-green-500': item.path === pathname
                  })}
                >
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Outlet />
    </div>
  )
}
