import {
  Ban,
  CheckCheck,
  Import,
  KeyRound,
  Loader,
  LogOut,
  MapPin,
  ReceiptText,
  Truck,
  UserRound,
  UserRoundPen
} from 'lucide-react'

import { OrderStatus } from '~/constants/enum'
import PATH from '~/constants/path'

export const USER_MENU = [
  {
    icon: UserRound,
    to: PATH.ME,
    label: 'Tài khoản'
  },
  {
    icon: UserRoundPen,
    to: PATH.ACCOUNT_PROFILE,
    label: 'Cập nhật tài khoản'
  },
  {
    icon: ReceiptText,
    to: PATH.ACCOUNT_ORDERS,
    label: 'Quản lý đơn hàng'
  },
  {
    icon: MapPin,
    to: PATH.ACCOUNT_ADDRESSES,
    label: 'Quản lý địa chỉ'
  },
  {
    icon: KeyRound,
    to: PATH.ACCOUNT_CHANGE_PASSWORD,
    label: 'Thay đổi mật khẩu'
  },
  {
    icon: LogOut,
    to: PATH.HOME,
    label: 'Đăng xuất'
  }
] as const

export const ORDER_STATUS_BADGE = {
  [OrderStatus.Waiting]: (
    <div className='flex items-center text-yellow-500 dark:text-yellow-600 text-sm font-medium tracking-tight'>
      <Loader className='size-4 mr-2' />
      <span>Chờ xác nhận</span>
    </div>
  ),
  [OrderStatus.Confirmed]: (
    <div className='flex items-center text-blue-500 text-sm font-medium tracking-tight'>
      <CheckCheck className='size-4 mr-2' />
      <span> Đã xác nhận</span>
    </div>
  ),
  [OrderStatus.Delivering]: (
    <div className='flex items-center text-emerald-500 dark:text-emerald-600 text-sm font-semibold tracking-tight'>
      <Truck className='size-4 mr-2' />
      <span>Đang vận chuyển</span>
    </div>
  ),
  [OrderStatus.Success]: (
    <div className='flex items-center text-green-500 dark:text-green-600 text-sm font-semibold tracking-tight'>
      <Import className='size-4 mr-2' />
      <span>Đã nhận hàng</span>
    </div>
  ),
  [OrderStatus.Cancel]: (
    <div className='flex items-center text-red-500 dark:text-red-600 text-sm font-semibold tracking-tight'>
      <Ban className='size-4 mr-2' />
      <span>Đã hủy</span>
    </div>
  )
} as const
