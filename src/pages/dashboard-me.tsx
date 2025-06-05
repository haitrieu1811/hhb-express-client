import { Loader2 } from 'lucide-react'
import moment from 'moment'
import React from 'react'

import ProfileForm from '~/components/profile-form'
import { Badge } from '~/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { UserStatus, UserVerifyStatus } from '~/constants/enum'
import useMe from '~/hooks/use-me'
import { convertMomentFromNowToVietnamese } from '~/lib/utils'

const statuses = {
  [UserStatus.Active]: <Badge className='bg-green-500'>Hoạt động</Badge>,
  [UserStatus.Inactive]: <Badge className='bg-red-500'>Ngừng hoạt động</Badge>
} as const

const verifyStatuses = {
  [UserVerifyStatus.Verified]: <Badge className='bg-green-500'>Đã xác minh</Badge>,
  [UserVerifyStatus.Unverified]: <Badge className='bg-red-500'>Chưa xác minh</Badge>
} as const

export default function DashboardMePage() {
  const { getMeQuery, meData } = useMe()

  const otherInfo = React.useMemo(
    () => [
      {
        label: 'Tạo lúc',
        value: convertMomentFromNowToVietnamese(moment(meData?.createdAt).fromNow())
      },
      {
        label: 'Cập nhật',
        value: convertMomentFromNowToVietnamese(moment(meData?.updatedAt).fromNow())
      },
      {
        label: 'Trạng thái tài khoản',
        value: meData?.status !== undefined ? statuses[meData.status] : ''
      },
      {
        label: 'Trạng thái xác minh tài khoản',
        value: meData?.verifyStatus !== undefined ? verifyStatuses[meData.verifyStatus] : ''
      }
    ],
    [meData]
  )

  return (
    <div className='grid grid-cols-12 gap-4'>
      <div className='col-span-8'>
        <Card>
          <CardHeader>
            <CardTitle className='text-xl'>Thông tin cơ bản</CardTitle>
          </CardHeader>
          <CardContent>
            {meData && <ProfileForm user={meData} />}
            {getMeQuery.isLoading && (
              <div className='flex justify-center p-20'>
                <Loader2 className='size-10 animate-spin' />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <div className='col-span-4'>
        <Card>
          <CardHeader>
            <CardTitle className='text-xl'>Thông tin khác</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-8'>
              {otherInfo.map((item, index) => (
                <div key={index} className='space-y-3'>
                  <div className='text-sm font-medium leading-none'>{item.label}</div>
                  <div className='text-sm text-muted-foreground'>{item.value}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
