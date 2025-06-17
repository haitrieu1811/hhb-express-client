import { CircleCheckBig } from 'lucide-react'
import { Link } from 'react-router'

import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import PATH from '~/constants/path'

export default function CartOrderSuccessPage() {
  return (
    <Card>
      <CardContent>
        <div className='flex flex-col justify-center items-center p-10 text-center space-y-6'>
          <CircleCheckBig className='size-20 stroke-green-500' />
          <p className='font-semibold text-lg text-green-500'>Đặt hàng thành công!</p>
          <p className='px-50 text-muted-foreground text-sm'>
            Cảm ơn vì đã cho chúng tôi có cơ hội phục vụ bạn, sản phẩm sẽ được nhanh chóng đến tay bạn.
          </p>
          <div className='space-x-3'>
            <Button asChild variant='outline'>
              <Link to={PATH.ACCOUNT_ORDERS}>Xem đơn hàng</Link>
            </Button>
            <Button asChild>
              <Link to={PATH.HOME}>Tiếp tục mua hàng</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
