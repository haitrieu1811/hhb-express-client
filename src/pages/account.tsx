import { Link, useLocation } from 'react-router'

import ProfileForm from '~/components/profile-form'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { USER_MENU } from '~/constants/data'
import useMe from '~/hooks/use-me'
import { cn } from '~/lib/utils'

export default function AccountPage() {
  const location = useLocation()
  const { meData } = useMe()
  return (
    <div className='flex justify-between space-x-6 py-6'>
      <aside className='space-y-2 w-1/6'>
        {USER_MENU.map((item) => {
          const isActive = item.to === location.pathname
          return (
            <Button
              asChild
              key={item.label}
              variant='ghost'
              disabled={isActive}
              className={cn('w-full justify-start', {
                'bg-muted': isActive
              })}
            >
              <Link to={item.to}>
                <item.icon className='size-4' />
                {item.label}
              </Link>
            </Button>
          )
        })}
      </aside>
      <div className='flex-1'>
        <Card className='rounded-md'>
          <CardHeader>
            <CardTitle className='text-lg'>Hồ sơ của tôi</CardTitle>
            <CardDescription>Quản lý thông tin hồ sơ để bảo mật tài khoản</CardDescription>
          </CardHeader>
          <CardContent>{meData && <ProfileForm user={meData} />}</CardContent>
        </Card>
      </div>
    </div>
  )
}
