import { KeyRound, LogOut, MapPin, ReceiptText, UserRound, UserRoundPen } from 'lucide-react'

import PATH from '~/constants/path'

export const USER_MENU = [
  {
    icon: UserRound,
    to: PATH.ME,
    label: 'Tài khoản'
  },
  {
    icon: UserRoundPen,
    to: PATH.ACCOUNT,
    label: 'Cập nhật tài khoản'
  },
  {
    icon: ReceiptText,
    to: PATH.HOME,
    label: 'Quản lý đơn hàng'
  },
  {
    icon: MapPin,
    to: PATH.HOME,
    label: 'Quản lý địa chỉ'
  },
  {
    icon: KeyRound,
    to: PATH.HOME,
    label: 'Thay đổi mật khẩu'
  },
  {
    icon: LogOut,
    to: PATH.HOME,
    label: 'Đăng xuất'
  }
] as const
