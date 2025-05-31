import { Truck } from 'lucide-react'
import { Link } from 'react-router'

import PATH from '~/constants/path'

export default function ShopFooter() {
  return (
    <footer className='bg-popover border-t'>
      <div className='w-7xl mx-auto'>
        <div className='grid grid-cols-12 gap-10 py-10'>
          <div className='col-span-4 space-y-4'>
            {/* Logo */}
            <Link to={PATH.HOME} className='flex items-center space-x-3'>
              <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
                <Truck className='size-6' />
              </div>
              <span className='font-bold text-lg tracking-tight'>MuaHangNhanh</span>
            </Link>
            <div className='text-sm space-y-1 text-muted-foreground'>
              <div>Điện thoại: 08 1919 8989</div>
              <div>Email: contact@fullstack.edu.vn</div>
              <div>Địa chỉ: Số 1, ngõ 41, Trần Duy Hưng, Cầu Giấy, Hà Nội</div>
            </div>
          </div>

          <div className='col-span-2 space-y-4'>
            <h3 className='font-semibold tracking-tight text-xl'>Về MHN</h3>
            <ul className='text-sm text-muted-foreground space-y-2'>
              <li>
                <Link to={PATH.HOME} className='hover:underline'>
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link to={PATH.HOME} className='hover:underline'>
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link to={PATH.HOME} className='hover:underline'>
                  Điều khoản
                </Link>
              </li>
              <li>
                <Link to={PATH.HOME} className='hover:underline'>
                  Bảo mật
                </Link>
              </li>
            </ul>
          </div>

          <div className='col-span-2 space-y-4'>
            <h3 className='font-semibold tracking-tight text-xl'>Về MHN</h3>
            <ul className='text-sm text-muted-foreground space-y-2'>
              <li>
                <Link to={PATH.HOME} className='hover:underline'>
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link to={PATH.HOME} className='hover:underline'>
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link to={PATH.HOME} className='hover:underline'>
                  Điều khoản
                </Link>
              </li>
              <li>
                <Link to={PATH.HOME} className='hover:underline'>
                  Bảo mật
                </Link>
              </li>
            </ul>
          </div>

          <div className='col-span-4 space-y-4'>
            <Link to={PATH.HOME} className='flex items-center space-x-3'>
              <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
                <Truck className='size-6' />
              </div>
              <span className='font-bold text-lg tracking-tight'>MuaHangNhanh</span>
            </Link>
            <div className='text-sm space-y-1 text-muted-foreground'>
              <div>Điện thoại: 08 1919 8989</div>
              <div>Email: contact@fullstack.edu.vn</div>
              <div>Địa chỉ: Số 1, ngõ 41, Trần Duy Hưng, Cầu Giấy, Hà Nội</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
